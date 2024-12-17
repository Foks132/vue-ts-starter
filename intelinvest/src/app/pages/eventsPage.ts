import { Component, UI } from "@intelinvest/platform/src/app/ui";
import Vue from "vue";
import { VDataTable } from "vuetify/lib/components";

interface Event {
    type: string;
    totalAmount: string;
}

@Component({
    // language=Vue
    template: `
    <v-app id="inspire">
        <v-data-table
        ref="selectedTable"
        :headers="headers"
        :items="events"
        :items-per-page="15"
        class="elevation-1"
        show-select
        item-key="id"
        @click:row="clickEvent"
        >
        <template v-slot:top>
        <v-card
        >
            <v-card-title>
                События 
            </v-card-title>
            <v-card-text>
                <div v-for="(sum, type) in sumByTypeEntries" :key="type">
                    {{ type }}: {{ sum }}
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" @click="getTotalAmmount">Показать выбранные</v-btn>
            </v-card-actions>
        </v-card>
        </template>
        </v-data-table>
    </v-app>
  `,
})

export class EventsPage extends UI {
    public typesSum = Vue.observable<{ [key: string]: number }>({});
    private events: any = [];

    private headers: any = [
        { text: "Дата", value: "date" },
        { text: "Сумма", value: "totalAmount" },
        { text: "Количество", value: "quantity" },
        { text: "Название", value: "label" },
        { text: "Комментарий", value: "comment" },
        { text: "Период", value: "period" },
    ];
    get sumByTypeEntries() {
        return this.typesSum;
    }

    async created(): Promise<void> {
        const params = {
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
        };
        const response = await fetch("http://localhost:3004/events", params);
        this.events = await response.json();
        this.events.forEach((event: any, index: number) => {
            event.id = index + 1;
        });
    }
    
    getTotalAmmount = (): void => {
        
        const selectedEvents: Event[] = Object.values(this.$refs.selectedTable?.selection || {});
        Object.keys(this.typesSum).forEach(key => {
            Vue.set(this.typesSum, key, 0);
        });

        selectedEvents.forEach(event => {
            const amount = Number.parseFloat(event.totalAmount.replace(/[^0-9.]/g, ""));
            if (!isNaN(amount)) {
                if (!this.typesSum[event.type]) {
                    Vue.set(this.typesSum, event.type, 0);
                }
                this.typesSum[event.type] += Math.round(amount * 100) / 100;
            }
        });

        Object.entries(this.typesSum).forEach((typeSum) => {
            Vue.set(this.typesSum, typeSum[0], Math.round(typeSum[1] * 100) / 100);
        });
    };

    clickEvent = (event: any): void => {
        localStorage.setItem("event-data", JSON.stringify(event));
        let routeData = this.$router.resolve({name: 'event', params: { id: event.id } });
        window.open(routeData.href, '_blank');
      };

}

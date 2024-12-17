import { Component, UI } from "@intelinvest/platform/src/app/ui";
import Vue from "vue";
import { VDataTable } from "vuetify/lib/components";

@Component({
    // language=Vue
    template: `
    <v-app id="inspire">
        <event-info :label="event.id.toString()" :event="event"></event-info>
    </v-app>
  `,
})

export class EventPage extends UI {
    public event = Vue.observable<Object>({});
    async created(): Promise<void> { 
        Object.assign(this.event, JSON.parse(localStorage.getItem("event-data")));
    }
}

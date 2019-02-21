/*
 * STRICTLY CONFIDENTIAL
 * TRADE SECRET
 * PROPRIETARY:
 *       "Intelinvest" Ltd, TIN 1655386205
 *       420107, REPUBLIC OF TATARSTAN, KAZAN CITY, SPARTAKOVSKAYA STREET, HOUSE 2, ROOM 119
 * (c) "Intelinvest" Ltd, 2019
 *
 * ������ ���������������
 * ������������ �����
 * �����������:
 *       ��� "���������������� ����������", ��� 1655386205
 *       420107, ���������� ���������, ����� ������, ����� �������������, ��� 2, ��������� 119
 * (c) ��� "���������������� ����������", 2019
 */

import {Inject} from "typescript-ioc";
import Component from "vue-class-component";
import {Prop, Watch} from "vue-property-decorator";
import {UI} from "../app/ui";
import {Filters} from "../platform/filters/Filters";
import {TABLES_NAME, TablesService} from "../services/tablesService";
import {AssetType} from "../types/assetType";
import {BigMoney} from "../types/bigMoney";
import {TableHeader} from "../types/types";

/**
 * ��������� ��� ����������� ���������� � ����������������� ���� ������, ��� ������� �������������� ������� �������
 */
@Component({
    // language=Vue
    template: `
        <v-card flat>
            <v-card-text>
                <div :class="['extended-info', hiddenHeaders.length > 7 ? 'two-column' : 'one-column']">
                    <slot></slot>

                    <template v-for="header in hiddenHeaders">
                        <div class="extended-info__cell label">{{ header.text }}</div>
                        <div v-if="header.value !== 'ticker'" :class="['extended-info__cell']">
                            {{ getCellValue(rowItem[header.value]) }}
                            <span :class="['extended-info__cell__second', getCellClass(rowItem[header.value])]"></span>
                        </div>
                        <div v-else-if="ticker" class="extended-info__cell">
                            <stock-link v-if="asset === AssetType.STOCK" :ticker="ticker"></stock-link>
                            <bond-link v-if="asset === AssetType.BOND" :ticker="ticker"></bond-link>
                        </div>
                    </template>
                </div>
            </v-card-text>
        </v-card>
    `
})
export class TableExtendedInfo extends UI {

    @Inject
    private tablesService: TablesService;
    /** ��������� ������������ ������� */
    @Prop({required: true})
    private headers: TableHeader[];
    /** ��� ������� */
    @Prop({required: true})
    private tableName: TABLES_NAME;
    /** ������������ ������ */
    @Prop({required: true})
    private rowItem: any;
    /** ��� ������ ������������ ������ */
    @Prop({required: true})
    private asset: AssetType;
    /** ����� */
    @Prop({required: false})
    private ticker: string;
    /** ������������ ����� ������ */
    private TABLES_NAME = TABLES_NAME;
    /** ���� ������� */
    private AssetType = AssetType;
    /** ������� ������� */
    private hiddenHeaders: TableHeader[];

    /**
     * ������������� ������
     * @inheritDoc
     */
    created(): void {
        this.setHiddenHeaders();
    }

    @Watch("headers")
    onHeadersChange(): void {
        this.setHiddenHeaders();
    }

    setHiddenHeaders(): void {
        this.hiddenHeaders = this.tablesService.getHiddenHeaders(this.tableName);
    }

    private getCellValue(value: string): string {
        try {
            return Filters.formatMoneyAmount(value);
        } catch (ignored) {
            return value;
        }
    }

    private getCellClass(value: string): string {
        try {
            return new BigMoney(value).currency.toLowerCase();
        } catch (ignored) {
            return "";
        }
    }
}

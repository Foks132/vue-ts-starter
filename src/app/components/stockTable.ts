/*
 * STRICTLY CONFIDENTIAL
 * TRADE SECRET
 * PROPRIETARY:
 *       "Intelinvest" Ltd, TIN 1655386205
 *       420107, REPUBLIC OF TATARSTAN, KAZAN CITY, SPARTAKOVSKAYA STREET, HOUSE 2, ROOM 119
 * (c) "Intelinvest" Ltd, 2018
 *
 * СТРОГО КОНФИДЕНЦИАЛЬНО
 * КОММЕРЧЕСКАЯ ТАЙНА
 * СОБСТВЕННИК:
 *       ООО "Интеллектуальные инвестиции", ИНН 1655386205
 *       420107, РЕСПУБЛИКА ТАТАРСТАН, ГОРОД КАЗАНЬ, УЛИЦА СПАРТАКОВСКАЯ, ДОМ 2, ПОМЕЩЕНИЕ 119
 * (c) ООО "Интеллектуальные инвестиции", 2018
 */
import {Inject} from "typescript-ioc";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {namespace} from "vuex-class/lib/bindings";
import {UI, Watch} from "../app/ui";
import {ShowProgress} from "../platform/decorators/showProgress";
import {BtnReturn} from "../platform/dialogs/customDialog";
import {PortfolioService} from "../services/portfolioService";
import {TableHeadersState, TABLES_NAME, TablesService} from "../services/tablesService";
import {TradeService} from "../services/tradeService";
import {AssetType} from "../types/assetType";
import {BigMoney} from "../types/bigMoney";
import {Operation} from "../types/operation";
import {Portfolio, StockPortfolioRow, TableHeader} from "../types/types";
import {CommonUtils} from "../utils/commonUtils";
import {SortUtils} from "../utils/sortUtils";
import {TradeUtils} from "../utils/tradeUtils";
import {MutationType} from "../vuex/mutationType";
import {StoreType} from "../vuex/storeType";
import {AddTradeDialog} from "./dialogs/addTradeDialog";
import {ConfirmDialog} from "./dialogs/confirmDialog";
import {EditShareNoteDialog, EditShareNoteDialogData} from "./dialogs/editShareNoteDialog";
import {ShareTradesDialog} from "./dialogs/shareTradesDialog";
import {PortfolioRowFilter} from "./portfolioRowsTableFilter";

const MainStore = namespace(StoreType.MAIN);

@Component({
    // language=Vue
    template: `
        <v-data-table class="data-table" :headers="headers" :items="filteredRows" item-key="stock.id"
                      :search="search" :custom-sort="customSort" :custom-filter="customFilter" hide-actions>
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template #headerCell="props">
                <v-tooltip v-if="props.header.tooltip" content-class="custom-tooltip-wrap" bottom>
                    <template #activator="{ on }">
                        <span class="data-table__header-with-tooltip" v-on="on">
                            {{ getHeaderText(props.header) }}
                        </span>
                    </template>
                    <span>
                      {{ props.header.tooltip }}
                    </span>
                </v-tooltip>
                <span v-else>
                    {{ getHeaderText(props.header) }}
                </span>
            </template>
            <template #items="props">
                <tr :class="['selectable', {'bold-row': !props.item.stock}]" @dblclick="props.expanded = !props.expanded">
                    <td>
                        <span v-if="props.item.stock" @click="props.expanded = !props.expanded"
                              :class="{'data-table-cell-open': props.expanded, 'path': true, 'data-table-cell': true}"></span>
                    </td>
                    <td v-if="tableHeadersState.company" class="text-xs-left">
                        <span v-if="props.item.stock">{{ props.item.stock.shortname }}</span>&nbsp;
                        <span v-if="props.item.stock" :class="markupClasses(Number(props.item.stock.change))">{{ props.item.stock.change }}&nbsp;%</span>
                    </td>
                    <td v-if="tableHeadersState.ticker" class="text-xs-left">
                        <stock-link v-if="props.item.stock" :ticker="props.item.stock.ticker"></stock-link>
                    </td>
                    <td v-if="tableHeadersState.quantity" class="text-xs-right ii-number-cell">{{props.item.quantity}}</td>
                    <td v-if="tableHeadersState.avgBuy" class="text-xs-right ii-number-cell">
                        <template>{{ props.item.avgBuy | amount(false, null, false) }}</template>
                    </td>
                    <td v-if="tableHeadersState.currPrice" class="text-xs-right ii-number-cell">
                        <template>{{ props.item.currPrice | amount(false, null, false) }}</template>
                    </td>
                    <td v-if="tableHeadersState.bcost" class="text-xs-right ii-number-cell">{{ props.item.bcost | amount(true) }}</td>
                    <td v-if="tableHeadersState.scost" class="text-xs-right ii-number-cell">{{ props.item.scost | amount(true) }}</td>
                    <td v-if="tableHeadersState.currCost" class="text-xs-right ii-number-cell">{{ props.item.currCost | amount(true) }}</td>
                    <td v-if="tableHeadersState.profitFromDividends" :class="markupClasses(amount(props.item.profitFromDividends))">
                        {{ props.item.profitFromDividends | amount(true) }}
                    </td>
                    <td v-if="tableHeadersState.profitFromDividendsPercent" :class="markupClasses(Number(props.item.profitFromDividendsPercent))">
                        {{ props.item.profitFromDividendsPercent }}
                    </td>
                    <td v-if="tableHeadersState.rateProfit" :class="markupClasses(amount(props.item.rateProfit))">{{ props.item.rateProfit | amount(true) }}</td>
                    <td v-if="tableHeadersState.rateProfitPercent" :class="markupClasses(Number(props.item.rateProfitPercent))">{{ props.item.rateProfitPercent }}</td>
                    <td v-if="tableHeadersState.exchangeProfit" :class="markupClasses(amount(props.item.exchangeProfit))">{{ props.item.exchangeProfit | amount(true) }}</td>
                    <td v-if="tableHeadersState.exchangeProfitPercent" :class="markupClasses(Number(props.item.exchangeProfitPercent))">{{ props.item.exchangeProfitPercent }}</td>
                    <td v-if="tableHeadersState.profit" :class="markupClasses(amount(props.item.profit))">{{ props.item.profit| amount(true) }}</td>
                    <td v-if="tableHeadersState.percProfit" :class="markupClasses(Number(props.item.percProfit))">{{ props.item.percProfit | number }}</td>
                    <td v-if="tableHeadersState.yearYield" :class="markupClasses(Number(props.item.yearYield))">{{ props.item.yearYield }}</td>
                    <td v-if="tableHeadersState.dailyPl" :class="markupClasses(amount(props.item.dailyPl))">{{ props.item.dailyPl | amount(true) }}</td>
                    <td v-if="tableHeadersState.dailyPlPercent" :class="markupClasses(Number(props.item.dailyPlPercent))">{{ props.item.dailyPlPercent }}</td>
                    <td v-if="tableHeadersState.summFee" class="text-xs-right ii-number-cell">{{ props.item.summFee | amount(true) }}</td>
                    <td v-if="tableHeadersState.percCurrShare" class="text-xs-right ii-number-cell">{{ props.item.percCurrShare | number }}</td>
                    <td class="justify-center layout px-0" @click.stop>
                        <v-menu v-if="props.item.stock" transition="slide-y-transition" bottom left>
                            <v-btn slot="activator" flat icon dark>
                                <span class="menuDots"></span>
                            </v-btn>
                            <v-list dense>
                                <v-list-tile @click="openShareTradesDialog(props.item.stock.ticker)">
                                    <v-list-tile-title>
                                        Все сделки
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="openEditShareNoteDialog(props.item.stock.ticker)">
                                    <v-list-tile-title>
                                        Заметка
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile @click="openTradeDialog(props.item, operation.BUY)">
                                    <v-list-tile-title>
                                        Купить
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="openTradeDialog(props.item, operation.SELL)">
                                    <v-list-tile-title>
                                        Продать
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="openTradeDialog(props.item, operation.DIVIDEND)">
                                    <v-list-tile-title>
                                        Дивиденд
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile @click="deleteAllTrades(props.item)">
                                    <v-list-tile-title>
                                        Удалить
                                    </v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>

            <template #expand="props">
                <table class="ext-info" @click.stop>
                    <tr>
                        <td>
                            <div class="ext-info__item">
                                Тикер
                                <span class="ext-info__ticker">
                                    <stock-link :ticker="props.item.stock.ticker"></stock-link>
                                </span><br>
                                В портфеле {{ props.item.ownedDays }} {{ props.item.ownedDays | declension("день", "дня", "дней") }}, c {{ props.item.firstBuy | date }}<br>
                                Кол-во полных лотов {{ props.item.lotCounts | number }} <span>шт.</span><br>
                                Всего {{ props.item.quantity | number }} <span>{{ props.item.quantity | declension("акция", "акции", "акций") }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                Прибыль по сделкам {{ props.item.exchangeProfit | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Прибыль по сделкам {{ props.item.exchangeProfitPercent | number }} <span>%</span><br>
                                Доходность {{ props.item.yearYield | number }} <span>%</span>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                Стоимость покупок {{ props.item.bcost | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Стоимость продаж {{ props.item.scost | amount }} <span>{{ portfolioCurrency }}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="ext-info__item">
                                Курсовая прибыль {{ props.item.rateProfit | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Курсовая прибыль {{ props.item.rateProfitPercent | number }} <span>%</span>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                P/L за день {{ props.item.dailyPl | amount }} <span>{{ portfolioCurrency }}</span><br>
                                P/L за день {{ props.item.dailyPlPercent | number }} <span>%</span><br>
                                Комиссия {{ props.item.summFee | amount }} <span>{{ portfolioCurrency }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                Дивиденды {{ props.item.profitFromDividends | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Прибыль по дивидендам {{ props.item.profitFromDividendsPercent | number }} <span>%</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </template>
        </v-data-table>
    `
})
export class StockTable extends UI {

    @Inject
    private tradeService: TradeService;
    @Inject
    private tablesService: TablesService;
    @Inject
    private portfolioService: PortfolioService;
    @MainStore.Getter
    private portfolio: Portfolio;
    @MainStore.Action(MutationType.RELOAD_PORTFOLIO)
    private reloadPortfolio: (id: string) => Promise<void>;
    /** Список заголовков таблицы */
    @Prop()
    private headers: TableHeader[];
    /** Список отображаемых строк */
    @Prop({default: [], required: true})
    private rows: StockPortfolioRow[];
    /** Поисковая строка */
    @Prop({required: false, type: String, default: ""})
    private search: string;
    /** Фильтр строк */
    @Prop({
        required: false, type: Object, default: (): PortfolioRowFilter => {
            return {};
        }
    })
    private filter: PortfolioRowFilter;
    /** Список отображаемых строк */
    private filteredRows: StockPortfolioRow[] = [];
    /** Состояние столбцов таблицы */
    private tableHeadersState: TableHeadersState;
    /** Текущая операция */
    private operation = Operation;
    /** Перечисление типов таблиц */
    private TABLES_NAME = TABLES_NAME;
    /** Типы активов */
    private AssetType = AssetType;

    /**
     * Инициализация данных
     * @inheritDoc
     */
    created(): void {
        /** Установка состояния заголовков таблицы */
        this.setHeadersState();
        this.setFilteredRows();
    }

    @Watch("headers")
    onHeadersChange(): void {
        this.setHeadersState();
    }

    @Watch("rows")
    onRowsChange(): void {
        this.setFilteredRows();
    }

    @Watch("filter", {deep: true})
    async onFilterChange(): Promise<void> {
        this.setFilteredRows();
    }

    setFilteredRows(): void {
        if (this.filter.hideSoldRows) {
            this.filteredRows = [...this.rows.filter(row => row.quantity !== 0)];
        } else {
            this.filteredRows = [...this.rows];
        }
    }

    setHeadersState(): void {
        this.tableHeadersState = this.tablesService.getHeadersState(this.headers);
    }

    @ShowProgress
    private async openShareTradesDialog(ticker: string): Promise<void> {
        await new ShareTradesDialog().show({trades: await this.tradeService.getShareTrades(this.portfolio.id, ticker), ticker});
    }

    /**
     * Обновляет заметки по бумага в портфеле
     * @param ticker тикер по которому редактируется заметка
     */
    private async openEditShareNoteDialog(ticker: string): Promise<void> {
        const data = await new EditShareNoteDialog().show({ticker, note: this.portfolio.portfolioParams.shareNotes[ticker]});
        if (data) {
            await this.editShareNote(data);
        }
    }

    @ShowProgress
    private async editShareNote(data: EditShareNoteDialogData): Promise<void> {
        await this.portfolioService.updateShareNotes(this.portfolio, data);
        this.$snotify.info(`Заметка по бумаге ${data.ticker} была успешно сохранена`);
    }

    private async openTradeDialog(stockRow: StockPortfolioRow, operation: Operation): Promise<void> {
        const result = await new AddTradeDialog().show({
            store: this.$store.state[StoreType.MAIN],
            router: this.$router,
            share: stockRow.stock,
            quantity: operation === Operation.DIVIDEND ? stockRow.quantity : null,
            operation,
            assetType: AssetType.STOCK
        });
        if (result) {
            await this.reloadPortfolio(this.portfolio.id);
        }
    }

    private async deleteAllTrades(stockRow: StockPortfolioRow): Promise<void> {
        const result = await new ConfirmDialog().show(`Вы уверены, что хотите удалить все сделки по ценной бумаге?`);
        if (result === BtnReturn.YES) {
            await this.deleteAllTradesAndReloadData(stockRow);
        }
    }

    @ShowProgress
    private async deleteAllTradesAndReloadData(stockRow: StockPortfolioRow): Promise<void> {
        await this.tradeService.deleteAllTrades({
            assetType: AssetType.STOCK.enumName,
            ticker: stockRow.stock.ticker,
            portfolioId: this.portfolio.id
        });
        await this.reloadPortfolio(this.portfolio.id);
    }

    private amount(value: string): number {
        if (!value) {
            return 0.00;
        }
        const amount = new BigMoney(value);
        return amount.amount.toNumber();
    }

    private customSort(items: StockPortfolioRow[], index: string, isDesc: boolean): StockPortfolioRow[] {
        return SortUtils.stockSort(items, index, isDesc);
    }

    private customFilter(items: StockPortfolioRow[], search: string): StockPortfolioRow[] {
        if (CommonUtils.isBlank(search)) {
            return items;
        }
        search = search.toLowerCase();
        return items.filter(row => {
            return row.stock && (row.stock.shortname.toLowerCase().includes(search) ||
                row.stock.ticker.toLowerCase().includes(search) ||
                row.stock.price.includes(search) ||
                row.yearYield.includes(search));
        });
    }

    private getHeaderText(header: TableHeader): string {
        return header.currency ? `${header.text} ${TradeUtils.getCurrencySymbol(this.portfolioCurrency)}` : header.text;
    }

    private markupClasses(amount: number): string[] {
        return TradeUtils.markupClasses(amount);
    }

    private get portfolioCurrency(): string {
        return TradeUtils.getCurrencySymbol(this.portfolio.portfolioParams.viewCurrency);
    }
}

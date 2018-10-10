import {Filters} from "../platform/filters/Filters";
import {AssetType} from "../types/assetType";
import {Operation} from "../types/operation";
import {TradeRow} from "../types/types";

export class TradeUtils {

    private constructor() {
    }

    static getPrice(trade: TradeRow): string {
        return this.moneyPrice(trade) ? Filters.formatMoneyAmount(trade.moneyPrice, true) : this.percentPrice(trade) ? trade.bondPrice :
            null;
    }

    static getFee(trade: TradeRow): string {
        return trade.asset === AssetType.MONEY.enumName ? null : Filters.formatMoneyAmount(trade.fee, true);
    }

    static percentPrice(trade: TradeRow): boolean {
        return trade.asset === AssetType.BOND.enumName && trade.operation !== Operation.COUPON.enumName && trade.operation !== Operation.AMORTIZATION.enumName;
    }

    static moneyPrice(trade: TradeRow): boolean {
        return trade.asset === AssetType.STOCK.enumName || (trade.operation === Operation.COUPON.enumName && trade.operation === Operation.AMORTIZATION.enumName);
    }
}

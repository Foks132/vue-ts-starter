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

import Decimal from "decimal.js";
import {AssetTrade} from "./assetTrade";
import {TradeDataHolder} from "./tradeDataHolder";

export class AssetSellTrade extends AssetTrade {

    total(holder: TradeDataHolder): string {
        const totalWithoutFee = new Decimal(holder.getPrice()).mul(new Decimal(holder.getQuantity())).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
        return holder.getFee() ? totalWithoutFee.minus(new Decimal(holder.getFee())).toString() : totalWithoutFee.toString();
    }

    signedTotal(holder: TradeDataHolder): string {
        return new Decimal(this.total(holder)).negated().toString();
    }
}
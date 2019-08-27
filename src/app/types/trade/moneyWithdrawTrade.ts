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

import {Decimal} from "decimal.js";
import {MoneyTrade} from "./moneyTrade";
import {TradeDataHolder} from "./tradeDataHolder";

export class MoneyWithdrawTrade extends MoneyTrade {

    total(holder: TradeDataHolder): string {
        return this.totalWithoutFee(holder);
    }

    signedTotal(holder: TradeDataHolder): string {
        return new Decimal(this.totalWithoutFee(holder)).negated().toString();
    }
}
import {Inject, Singleton} from "typescript-ioc";
import {Service} from "../platform/decorators/service";
import {Http} from "../platform/services/http";
import {Tariff} from "../types/tariff";

@Service("TariffService")
@Singleton
export class TariffService {

    @Inject
    private http: Http;

    /**
     * Отправляет запрос на создание заказа для оплаты тарифа
     * @param tariff выбранный тариф
     * @param monthly признак оплаты за месяц
     */
    async makePayment(tariff: Tariff, monthly: boolean): Promise<TinkoffPaymentOrderResponse> {
        return this.http.post<TinkoffPaymentOrderResponse>("/tariff/payment", {tariff: tariff.name, monthly});
    }

    /**
     * Применяет промокод
     * @param promoCode промокод
     */
    async applyPromoCode(promoCode: string): Promise<void> {
        await this.http.post(`/tariff/apply-promo-code/${promoCode}`);
    }

    async getPaymentInfo(): Promise<UserPaymentInfo> {
        return this.http.get<UserPaymentInfo>("/tariff/payment-info");
    }

    async cancelOrderSchedule(): Promise<void> {
        return this.http.post("/tariff/cancel-order-schedule");
    }
}

/** Запрос на оплату тарифа */
export interface PayTariffRequest {
    /** Оплачиваемый тариф */
    tariff: Tariff;
    /** Признак оплаты за месяц. */
    monthly: boolean;
}

/** Ответ на оплату тарифа */
export interface PayTariffResponse {
    /** Оплачиваемый заказ */
    paymentOrder: PaymentOrder;
    /** Ключ терминала для оплаты */
    terminalKey: string;
}

/**
 * Сущность ответа от платежного шлюза Тинькоф
 */
export interface TinkoffPaymentOrderResponse {
    /** Идентификатор терминала, выдается Продавцу Банком */
    terminalKey: string;
    /** Сумма в копейках */
    amount: number;
    /** Номер заказа в системе Продавца */
    orderId: string;
    /** Успешность операции */
    success: boolean;
    /** Статус транзакции */
    status: string;
    /** Уникальный идентификатор транзакции в системе Банка */
    paymentId: string;
    /** Код ошибки, «0» - если успешно */
    errorCode: string;
    /** Ссылка на страницу оплаты. По умолчанию ссылка доступна в течении 24 часов. */
    paymentURL?: string;
    /** Краткое описание ошибки */
    message?: string;
    /** Подробное описание ошибки */
    details?: string;
}

/** Информация об оплате тарифа */
export interface PaymentOrder {
    /** Идентификатор пользователя */
    userId: string;
    /** Идентификатор заказа в системе */
    orderId: string;
    /** Оплачиваемый тариф */
    tariff: Tariff;
    /** Сумма оплаты в копейках */
    amount: number;
    /** Оплачиваемый период. Количество месяцев */
    period: number;
    /** Признак завершенного заказа */
    done: boolean;
}

/** Данные для оплаты заказа в эквайринге */
export interface PaymentParams {
    /** Код терминала (обязательный параметр), выдается банком. */
    TerminalKey: string;
    /** Сумма заказа в копейках (обязательный параметр) */
    Amount: number;
    /** Номер заказа (если не передан, принудительно устанавливается timestamp) */
    OrderId: string;
    /** Описание заказа (не обязательный параметр */
    Description: string;
    /** Дополнительные параметры платежа */
    DATA: string;
    /** Флаг открытия платежной формы во фрейме */
    Frame: boolean;
}

/** Поля, содержащию информацию о способе оплаты подписки пользователя */
export interface UserPaymentInfo {
    /** Маскированный номер карты в виде **** 1234 */
    pan: string;
    /** Срок действия карты */
    expDate: string;
}

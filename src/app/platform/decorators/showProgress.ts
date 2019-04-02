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

import {LoaderState} from "../../components/loaderState";

/**
 * ��������� �� ����� ��� ����������� ������� �� ����� ���������� ������
 * @param target ������, ���������� �����
 * @param {string} propertyKey �������� ������ � �������
 * @param {TypedPropertyDescriptor<T>} descriptor ���������� ������
 * @return {TypedPropertyDescriptor<T>} ����� ���������� ������
 */
// tslint:disable-next-line
export function ShowProgress<T extends Function>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>):
    TypedPropertyDescriptor<(...args: any[]) => Promise<any>> {
    const originalMethod = descriptor.value;
    // tslint:disable-next-line
    descriptor.value = async function (...args: any[]) {
        const progressDialog = new LoaderState();
        try {
            progressDialog.show();
            // @ts-ignore
            return await originalMethod.apply(this, args);
        } finally {
            progressDialog.hide();
        }
    } as any;
    return descriptor;
}
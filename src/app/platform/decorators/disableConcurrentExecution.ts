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

/**
 * ��������� �� �����, ��� �������������� ���������� ������ ���� ���������� ����������
 * @param target      ������, ���������� ������������ �����
 * @param propertyKey ��� ������������� ������
 * @param descriptor  ���������� ������������� ������
 * @return ��������� ���������� ������������� ������
 * @constructor
 */
export function DisableConcurrentExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;
    let enable = true;
    // tslint:disable-next-line:typedef
    descriptor.value = async function(...args: any[]) {
        if (enable) {
            enable = false;
            try {
                return await originalMethod.apply(this, args);
            } finally {
                enable = true;
            }
        }
    };
    return descriptor;
}
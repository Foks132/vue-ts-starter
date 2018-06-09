import Vue from "vue";
import Component from "vue-class-component";
import {Emit, Model, Prop, Watch} from "vue-property-decorator";
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

Component.registerHooks([
    "beforeRouteEnter",
    "beforeRouteLeave",
    "beforeRouteUpdate"
]);

export {Component, Emit, Model, Prop, Watch};
export {Action, Getter, Mutation, namespace, State};

export class UI extends Vue {

    /**
     * ���������� ���� �������
     */
    private static eventBus = new Vue();

    /**
     * ����������� ��������� �� ���������� �������
     * @param event    �������
     * @param callback ���������� �������
     */
    static on(event: string | string[], callback: (...args: any[]) => any) {
        UI.eventBus.$on(event, callback);
    }

    /**
     * ���������� ��������� �� ����������� �������
     * @param event    �������
     * @param callback ���������� �������
     */
    static off(event?: string | string[], callback?: (...args: any[]) => any) {
        UI.eventBus.$off(event, callback);
    }

    /**
     * ���������� � ����������� ����������� �������
     * @param event �������
     * @param args  ������
     */
    static emit(event: string, ...args: any[]) {
        UI.eventBus.$emit(event, ...args);
    }
}
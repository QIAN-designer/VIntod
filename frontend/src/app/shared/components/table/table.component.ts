import { CommonModule } from "@angular/common";
import { Component, Input, TemplateRef } from "@angular/core";

export interface TableColumn<T = any> {
    key: string;
    label: string;
    sortable?: boolean;
    align?: "left" | "center" | "right";
    width?: string;
    cellTemplate?: TemplateRef<any>;
}

@Component({
    selector: "app-table",
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead class="bg-gray-50/75">
                    <tr>
                        @for (col of columns; track col.key) {
                            <th
                                scope="col"
                                class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500"
                                [class.text-center]="col.align === 'center'"
                                [class.text-right]="col.align === 'right'"
                                [class.text-left]="!col.align || col.align === 'left'"
                                [style.width]="col.width || 'auto'"
                            >
                                {{ col.label }}
                            </th>
                        }
                        @if (hasActions) {
                            <th
                                scope="col"
                                class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                Acciones
                            </th>
                        }
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    @if (loading) {
                        <tr>
                            <td
                                [attr.colspan]="columns.length + (hasActions ? 1 : 0)"
                                class="px-5 py-12 text-center text-gray-500"
                            >
                                <div class="inline-flex items-center gap-2">
                                    <div
                                        class="h-5 w-5 animate-spin rounded-full border-2 border-vinted border-t-transparent"
                                    ></div>
                                    <span>Cargando datos...</span>
                                </div>
                            </td>
                        </tr>
                    } @else if (data.length === 0) {
                        <tr>
                            <td
                                [attr.colspan]="columns.length + (hasActions ? 1 : 0)"
                                class="px-5 py-12 text-center text-gray-500"
                            >
                                <p class="text-sm font-medium text-gray-600">{{ emptyMessage }}</p>
                                <p class="mt-1 text-xs text-gray-400">
                                    Prueba ajustando los filtros o añadiendo nuevos elementos.
                                </p>
                            </td>
                        </tr>
                    } @else {
                        @for (row of data; track trackByFn(row)) {
                            <tr class="hover:bg-gray-50/60 transition-colors">
                                @for (col of columns; track col.key) {
                                    <td
                                        class="whitespace-nowrap px-5 py-4 text-sm text-gray-700"
                                        [class.text-center]="col.align === 'center'"
                                        [class.text-right]="col.align === 'right'"
                                    >
                                        @if (col.cellTemplate) {
                                            <ng-container
                                                *ngTemplateOutlet="
                                                    col.cellTemplate;
                                                    context: { $implicit: row, row: row }
                                                "
                                            ></ng-container>
                                        } @else {
                                            {{ row[col.key] }}
                                        }
                                    </td>
                                }
                                @if (hasActions) {
                                    <td class="whitespace-nowrap px-5 py-4 text-right text-sm font-medium">
                                        <ng-container
                                            *ngTemplateOutlet="actionsTemplate; context: { $implicit: row, row: row }"
                                        ></ng-container>
                                    </td>
                                }
                            </tr>
                        }
                    }
                </tbody>
            </table>
        </div>
    `,
})
export class TableComponent {
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() loading = false;
    @Input() emptyMessage = "No se encontraron registros";
    @Input() hasActions = false;
    @Input() actionsTemplate!: TemplateRef<any>;
    @Input() trackKey = "_id";

    trackByFn(item: any): any {
        return item[this.trackKey] || item.id || JSON.stringify(item);
    }
}

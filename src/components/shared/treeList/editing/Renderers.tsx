import React, { ReactElement } from 'react';

export type DataItemType = { [key: string]: unknown };

type EnterEditFunc = (dataItem: DataItemType, field: string) => void;
type ExitEditFunc = () => void;

export class Renderers {
    enterEdit: EnterEditFunc;
    exitEdit: ExitEditFunc;
    editFieldName;
    preventExit: boolean | undefined;
    preventExitTimeout: string | number | NodeJS.Timeout | undefined;
    blurTimeout: string | number | NodeJS.Timeout | undefined;

    constructor(enterEdit: EnterEditFunc, exitEdit: ExitEditFunc, editFieldName: string) {
        this.enterEdit = enterEdit;
        this.exitEdit = exitEdit;
        this.editFieldName = editFieldName;
    }

    // cellRender?: (defaultRendering: React.ReactElement<HTMLTableCellElement> | null, props: TreeListCellProps) => React.ReactElement<HTMLTableCellElement> | null;
    cellRender = (
        tdElement: React.ReactElement<HTMLTableCellElement> | null,
        cellProps: { dataItem: DataItemType; field?: string }
    ): React.ReactElement<HTMLTableCellElement> | null => {
        if (!tdElement) {
            throw new Error('DefaultRendering for TD element is not specified!');
        }

        const dataItem = cellProps.dataItem;
        const field = cellProps.field;
        const editedField = cellProps.dataItem[this.editFieldName];
        const additionalProps =
            editedField && cellProps.field === editedField
                ? {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ref: (td: { querySelector: (arg0: string) => any }) => {
                          const input = td && td.querySelector('input');
                          if (!input || input === document.activeElement) {
                              return;
                          }
                          if (input.type === 'checkbox') {
                              input.focus();
                          } else {
                              input.select();
                          }
                      },
                  }
                : {
                      onClick: (event: { target: { classList: DOMTokenList } }) => {
                          const targetClasses = event.target.classList;
                          if (
                              targetClasses &&
                              (targetClasses.contains('k-i-expand') || targetClasses.contains('k-i-collapse'))
                          ) {
                              return;
                          }
                          this.enterEdit.call(undefined, dataItem, field!);
                      },
                  };

        return React.cloneElement(
            tdElement,
            { ...tdElement.props, ...additionalProps },
            <>{tdElement.props.children}</>
        );
    };

    // render?: (row: React.ReactElement<HTMLTableRowElement>, props: TreeListRowProps) => React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rowRender = (trElement: ReactElement<HTMLTableRowElement>, _dataItem: unknown): React.ReactNode => {
        const trProps = {
            ...trElement.props,
            onMouseDown: () => {
                this.preventExit = true;
                clearTimeout(this.preventExitTimeout);
                this.preventExitTimeout = setTimeout(() => {
                    this.preventExit = undefined;
                });
            },
            onBlur: () => {
                clearTimeout(this.blurTimeout);
                if (!this.preventExit) {
                    this.blurTimeout = setTimeout(() => {
                        this.exitEdit.call(undefined);
                    });
                }
            },
            onFocus: () => {
                clearTimeout(this.blurTimeout);
            },
        };
        return React.cloneElement(trElement, { ...trProps }, <>{trElement.props.children}</>);
    };
}

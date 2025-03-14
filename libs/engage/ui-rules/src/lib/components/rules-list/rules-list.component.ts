/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { makeEventDisplay } from '@engage/data-access';
import { Rule } from '@engage/remote-api';
import { DeleteModalComponent, ToastComponent } from '@engage/ui-common';

@Component({
  selector: 'dgs-rules-list',
  templateUrl: './rules-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesListComponent {
  @Input() selectedIDs: string[] = [];
  @Input() rules: Rule[] = [];
  @Output() onRuleSelected = new EventEmitter<string>();
  @Output() onRuleDeleted = new EventEmitter<string>();

  constructor(
    public dialog: Dialog,
    private router: Router
  ) {}

  trackRule(_: number, item: Rule): string {
    return item.id;
  }

  getEventDisplay(event: string) {
    return makeEventDisplay(event).displayName;
  }

  onRuleEdit(rule: Rule, e?: Event) {
    e?.stopPropagation();

    this.onRuleSelected.emit(rule.id);
    this.router.navigateByUrl(`/rules/${rule.id}/edit`);
  }

  onRuleDelete(rule: Rule, e?: Event) {
    e?.stopPropagation();

    const dialogRef = this.dialog.open<boolean>(DeleteModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: 'dialog',
      data: {
        title: 'Delete Rule',
        message: `Are you sure you want to delete this rule?`,
      },
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.onRuleDeleted.emit(rule.id);

        this.dialog.open(ToastComponent, {
          disableClose: true,
          autoFocus: false,
          hasBackdrop: false,
          scrollStrategy: new NoopScrollStrategy(),
          data: { message: 'Rule has been deleted.' },
        });
      }
    });
  }
}

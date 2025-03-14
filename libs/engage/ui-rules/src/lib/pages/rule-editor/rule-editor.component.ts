import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Dialog } from '@angular/cdk/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ToastComponent } from '@engage/ui-common';

import { BOOTSTRAP_SETTINGS, BootstrapSettings } from '@degreed/core-angular';
import { Rule, makeRule } from '@engage/remote-api';

import { RulesFacade } from '@engage/data-access';

import { lastValueFrom } from 'rxjs';
import { buildConfiguration, prepareRule } from '../../utils';

@Component({
  selector: 'dgs-rule-editor',
  templateUrl: './rule-editor.component.html',
})
export class RuleEditorComponent implements OnInit {
  rule?: Rule;
  events$ = this.facade.events$;
  ruleForm = this.fb.nonNullable.group({
    ruleName: '',
    outcomes: this.fb.array([
      this.fb.nonNullable.group({
        emailSubject: '',
        emailContent: '',
      }),
    ]),
    predicates: this.fb.array([
      this.fb.nonNullable.group({
        comparisonValue: '',
      }),
    ]),
  });

  get ruleName() {
    return this.ruleForm.get('ruleName');
  }

  get outcomes() {
    return this.ruleForm.controls['outcomes'] as FormArray;
  }

  get predicates() {
    return this.ruleForm.controls['predicates'] as FormArray;
  }

  get emailSubject() {
    return this.outcomes.get('emailSubject');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorConfig: any;

  showTitle = false;

  private _contentIsReady = false;

  constructor(
    private facade: RulesFacade,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: Dialog,
    @Inject(BOOTSTRAP_SETTINGS) private apiSettings: BootstrapSettings
  ) {
    this.editorConfig = buildConfiguration(this.apiSettings.cdnUrl);
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Load the rule and populate the form when editing
      this.rule = await lastValueFrom(this.facade.loadRule(id));
      this.ruleForm.get('ruleName')?.setValue(this.rule.ruleName);
      this.outcomes.setValue(
        this.rule.outcomes.map((outcome) => ({
          emailSubject: outcome.emailTemplate?.emailSubject,
          emailContent: outcome.emailTemplate?.emailContent,
        }))
      );
      this.predicates.setValue(
        this.rule.predicates.map((predicate) => ({
          comparisonValue: predicate.comparisonValue,
        }))
      );
    } else {
      this.rule = makeRule(this.apiSettings.organizationId);
    }
  }

  /**
   * Hack to wait for the editor's content to be ready before saving the rule. (Part 1)
   * This is needed because the custom Merge Tags plugin isn't making the editor's content ready when the form is submitted
   * before the prepareRule call accesses the form's value.
   * @TODO - remove this hack when the custom Merge Tags plugin is fixed.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGetContent({ event }: any) {
    const { save = false } = event;

    if (save) {
      this._contentIsReady = true;
    }
  }

  /**
   * Hack to wait for the editor's content to be ready before saving the rule. (Part 2)
   * Loop and wait until the content is ready.
   */
  async waitForContentToBeReady() {
    this._contentIsReady = false;

    while (!this._contentIsReady) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async saveRule() {
    // Wait for the editor's content to be ready before saving the rule.
    await this.waitForContentToBeReady();

    if (this.rule) {
      const r = this.rule;
      const rule = prepareRule(r, this.outcomes, this.predicates, this.ruleForm);
      const saved = await this.facade.saveRule(rule);

      if (saved) {
        this.dialog.open(ToastComponent, {
          disableClose: true,
          autoFocus: false,
          hasBackdrop: false,
          scrollStrategy: new NoopScrollStrategy(),
          data: { message: 'Rule has been saved.' },
        });

        this.router.navigateByUrl('/rules');
      } else {
        // @TODO - show error UX if rule save failed.
        console.error('Failed to save rule');
      }
    }
  }
}

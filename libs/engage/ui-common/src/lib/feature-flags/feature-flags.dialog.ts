import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EngageFeatureFlags } from '@engage/data-access';

@Component({
  selector: 'dgs-feature-flags-dialog',
  templateUrl: 'feature-flags.dialog.html',
})
export class FeatureFlagsDialogComponent {
  featureFlagsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EngageFeatureFlags>,
    @Inject(DIALOG_DATA) public featureFlags: EngageFeatureFlags
  ) {
    this.featureFlagsForm = this.fb.group({
      enableRuleSelection: [featureFlags.allowRuleSelection ?? false],
      enableAutoNavigation: [featureFlags.allowAutoNavigation ?? false],
    });
  }

  onSubmit() {
    const features = this.featureFlags.update(this.featureFlagsForm.value);
    this.dialogRef.close(features);
  }

  onCancel() {
    this.dialogRef.close();
  }
}

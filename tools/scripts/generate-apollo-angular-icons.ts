/**
 *  Why is this generator needed?
 *
 *
 */
import { exec } from 'child_process';
import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import { outdent } from 'outdent';
import { join } from 'path';

const ICONS_MODULE_DIR = join(__dirname, '../apps/playground-angular/src/lib');

interface SvgProp {
  size: string;
  type: string;
  content: string;
}

const toPascalComponentName = (componentName: string) =>
  componentName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

async function generateBaseIconComponent(targetDir: string) {
  // Generate base icon component
  const baseIconContent = outdent`
    import { Component, Input } from '@angular/core';

    @Component({
      template: '',
    })
    export abstract class BaseIconComponent {
      @Input() class = '';
      @Input() iconClass = '';
      @Input() type: 'solid' | 'outline' = 'outline';
      @Input() solidSize: 16 | 20 | 24 = 24;
      
      isValidIcon(): boolean {
        return ['solid', 'outline'].includes(this.type) && [16, 20, 24].includes(this.solidSize);
      }
    }
  `;
  const baseIconPath = join(targetDir, '_abstract.ts');
  await writeFile(baseIconPath, baseIconContent, 'utf8');

  console.log('Generated base icon component');
}

async function generateApolloIconComponent(targetDir: string) {
  // Generate apollo icon component
  const apolloIconContent = outdent`
    import { Component, Input, OnChanges, ViewChild, ViewContainerRef } from '@angular/core';

    import { BaseIconComponent } from './components/_abstract';
    import { iconComponent } from './components/_registry';
    
    /**
     * Primary Icon component that internally supports all Apollo icons.
     * Uses an internal look up of the icon specified by name and settings
     */
    @Component({
      selector: 'da-apollo-icon',
      template: '<ng-template #container></ng-template>',
    })
    export class ApolloIconComponent extends BaseIconComponent implements OnChanges {
      @Input() icon = '';
    
      @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
    
      ngOnChanges(): void {
        this.loadComponent();
      }
    
      private loadComponent() {
        const component = iconComponent(this.icon); // look up component in Icon registry
        if (component) {
          this.container.clear();
          const ref = this.container.createComponent(component);
          ref.setInput('iconClass', this.iconClass);
          ref.setInput('type', this.type);
          ref.setInput('solidSize', this.solidSize);
        }
      }
    }
  `;
  const apolloIconPath = join(targetDir, 'apollo-icon.ts');
  await writeFile(apolloIconPath, apolloIconContent, 'utf8');

  console.log('Generated apollo icon component');
}

async function generateIconsModule(
  targetDir: string,
  svgContents: { [key: string]: SvgProp[] },
) {
  // Generate icons module
  const moduleContent = outdent`
    import { CommonModule } from '@angular/common';
    import { NgModule } from '@angular/core';

    import { ApolloIconComponent } from './apollo-icon';
      
    ${Object.keys(svgContents)
      .map(
        (componentName) =>
          `import { ${toPascalComponentName(componentName)}IconComponent } from './components/${componentName}';`,
      )
      .join('\n')}

    @NgModule({
      declarations: [
        ApolloIconComponent,
        ${Object.keys(svgContents)
          .map(
            (componentName) =>
              `${toPascalComponentName(componentName)}IconComponent,`,
          )
          .join('\n\t\t')}
      ],
      imports: [CommonModule],
      exports: [
        ApolloIconComponent
      ],
    })
    export class IconsModule {}
  `;
  const modulePath = join(targetDir, 'icons.module.ts');
  await writeFile(modulePath, moduleContent, 'utf8');

  console.log('Generated icons module');
}

async function generateIconsBarrelFile(
  targetDir: string,
  svgContents: { [key: string]: SvgProp[] },
) {
  // Generate icons index
  const indexContent = `
    export * from './components/_registry';
    
    export * from './icons.module';
    export * from './apollo-icon';
  `;
  const indexPath = join(targetDir, 'index.ts');
  await writeFile(indexPath, indexContent, 'utf8');

  console.log('Generated icons barrel file (index.ts)');
}

async function generateIconComponentsRegistry(
  targetDir: string,
  svgContents: { [key: string]: SvgProp[] },
) {
  // Generate icon components registry
  const iconComponentsRegistryContent = outdent`
    import { Type } from '@angular/core';

    ${Object.keys(svgContents)
      .map(
        (componentName) =>
          `import { ${toPascalComponentName(componentName)}IconComponent } from './${componentName}';`,
      )
      .join('\n')}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iconComponentsRegistry: { [key: string]: Type<any> } = {
      ${Object.keys(svgContents)
        .map(
          (componentName) =>
            `'${componentName}': ${toPascalComponentName(componentName)}IconComponent,`,
        )
        .join('\n\t')}
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function iconComponent(name: string): Type<any> | null {
      const component = name ? iconComponentsRegistry[name] : null;

      if (!component) console.error(\`Component not found: \${name}\`);

      return component;
    }
  `;
  const iconComponentsRegistryPath = join(targetDir, '_registry.ts');
  await writeFile(
    iconComponentsRegistryPath,
    iconComponentsRegistryContent,
    'utf8',
  );

  console.log('Generated icon components registry');
}

async function generateIconComponents(
  optimizedDir: string,
  iconsDir: string,
  componentsDir: string,
) {
  const svgContents: { [key: string]: SvgProp[] } = {};

  // Loop through the optimized directory to get the size (16, 20, 24) directories
  const sizes = await readdir(optimizedDir, { withFileTypes: true });
  for (const size of sizes) {
    if (!size.isDirectory()) {
      continue;
    }

    // Loop through each size directory to get the type (solid, outline) directories
    const types = await readdir(join(optimizedDir, size.name), {
      withFileTypes: true,
    });
    for (const type of types) {
      if (!type.isDirectory()) {
        continue;
      }

      // Loop through each type directory to get the SVG files
      const files = await readdir(join(optimizedDir, size.name, type.name));
      for (const file of files) {
        let svgContent = await readFile(
          join(optimizedDir, size.name, type.name, file),
          'utf8',
        );
        svgContent = svgContent.replace(
          'data-slot="icon"',
          'data-slot="icon" [class]="class || iconClass"',
        );
        const componentName: string = file.replace('.svg', '');
        if (!svgContents[componentName]) {
          svgContents[componentName] = [];
        }
        svgContents[componentName].push({
          size: size.name,
          type: type.name,
          content: svgContent,
        });
      }
    }
  }

  // Generate components
  for (const [componentName, props] of Object.entries(svgContents)) {
    const pascalComponentName = toPascalComponentName(componentName);
    const componentContent = outdent`
      import { Component } from '@angular/core';
      
      import { BaseIconComponent } from './_abstract';

      @Component({
        selector: 'da-${componentName}-icon',
        template: \`${props
          .map(
            (svg) => `
            <ng-container *ngIf="type === '${svg.type}'${svg.type === 'solid' ? ` && solidSize === ${svg.size}` : ''}">
              ${svg.content.trim()}
            </ng-container>
          `,
          )
          .join('')}
          <ng-container *ngIf="!isValidIcon()"> Unknown icon </ng-container>\`,
      })
      export class ${pascalComponentName}IconComponent extends BaseIconComponent {}
    `;

    const componentPath = join(componentsDir, `${componentName}.ts`);
    await writeFile(componentPath, componentContent, 'utf8');

    console.log(`Generated component for ${componentName}`);
  }

  return svgContents;
}

async function main() {
  // Get the path to the heroicons directory from an argument
  const heroiconsDir = process.argv[2];
  if (!heroiconsDir) {
    console.log(outdent`
      Please provide the path to the 'heroicons' directory
      You can clone the repository with the following command:
      -------
      cd tmp
      git clone --depth=1 git@github.com:tailwindlabs/heroicons.git
      -------

      Now you have the 'heroicons' directory in the 'tmp' directory
      Then run this script:
      -------
      npx ts-node tools/generate-apollo-angular-icons.ts tmp/heroicons
      -------
    `);
    process.exit(1);
  }

  // Check if the heroicons directory exists
  try {
    await readdir(heroiconsDir);
  } catch (error) {
    console.log(outdent`
      The directory "${heroiconsDir}" does not exist
      You can clone the repository to that directory with the following command:
      -------
      git clone --depth=1 git@github.com:tailwindlabs/heroicons.git ${heroiconsDir}
      -------
    `);
    process.exit(1);
  }

  const optimizedDir = join(heroiconsDir, 'optimized');
  const iconsDir = join(__dirname, ICONS_MODULE_DIR, 'icons');
  const componentsDir = join(iconsDir, 'components');

  // Ensure the icons/components directory exists
  // If it already exists, it will not throw an error due to the recursive option
  await mkdir(componentsDir, { recursive: true });

  await generateApolloIconComponent(iconsDir);
  await generateBaseIconComponent(componentsDir);

  const svgContents = await generateIconComponents(
    optimizedDir,
    iconsDir,
    componentsDir,
  );
  await generateIconsModule(iconsDir, svgContents);
  await generateIconsBarrelFile(iconsDir, svgContents);
  await generateIconComponentsRegistry(componentsDir, svgContents);

  // Format the generated files
  exec(`npx prettier --write "${iconsDir}"`);
  console.log('Formatted generated files with Prettier');
}

// Run the main function
main();

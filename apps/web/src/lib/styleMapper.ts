export interface DesignData {
  design_padding_top?: string;
  design_padding_bottom?: string;
  design_margin_top?: string;
  design_margin_bottom?: string;
  design_text_align?: string;
  design_text_color?: string;
  design_background_color?: string;
  design_background_opacity?: number;
  design_image_opacity?: number;
  design_blur_effect?: string;
  design_custom_css_classes?: string;
}

export interface ItemDesignData {
  item_design_background_color?: string;
  item_design_text_color?: string;
  item_design_background_opacity?: number;
  item_design_custom_css_classes?: string;
}

export function parseDesign(design: any) {
  if (!design) return { classes: '', styles: {} };

  const classes: string[] = [];
  const styles: any = {};

  // Padding
  if (design.design_padding_top && design.design_padding_top !== 'none') classes.push(`pt-${getSpacing(design.design_padding_top)}`);
  if (design.design_padding_bottom && design.design_padding_bottom !== 'none') classes.push(`pb-${getSpacing(design.design_padding_bottom)}`);

  // Margin
  if (design.design_margin_top && design.design_margin_top !== 'none') classes.push(`mt-${getSpacing(design.design_margin_top)}`);
  if (design.design_margin_bottom && design.design_margin_bottom !== 'none') classes.push(`mb-${getSpacing(design.design_margin_bottom)}`);

  // Text Align
  if (design.design_text_align && design.design_text_align !== 'inherit') classes.push(`text-${design.design_text_align}`);

  // Blur
  if (design.design_blur_effect && design.design_blur_effect !== 'none') {
    classes.push(`backdrop-blur-${design.design_blur_effect}`);
  }

  // Custom CSS Classes
  if (design.design_custom_css_classes) {
    classes.push(design.design_custom_css_classes);
  }

  // Inline Styles
  if (design.design_background_color) {
    const opacity = design.design_background_opacity !== undefined ? design.design_background_opacity / 100 : 1;
    styles.backgroundColor = hexToRgba(design.design_background_color, opacity);
  }

  if (design.design_text_color) {
    styles.color = design.design_text_color;
  }

  return {
    classes: classes.join(' '),
    styles,
  };
}

export function parseItemDesign(design: any) {
  if (!design) return { classes: '', styles: {} };

  const classes: string[] = [];
  const styles: any = {};

  if (design.item_design_custom_css_classes) {
    classes.push(design.item_design_custom_css_classes);
  }

  if (design.item_design_background_color) {
    const opacity = design.item_design_background_opacity !== undefined ? design.item_design_background_opacity / 100 : 1;
    styles.backgroundColor = hexToRgba(design.item_design_background_color, opacity);
  }

  if (design.item_design_text_color) {
    styles.color = design.item_design_text_color;
  }

  return {
    classes: classes.join(' '),
    styles,
  };
}

// Map spacing enum to Tailwind scale
function getSpacing(val: string): string {
  const map: Record<string, string> = {
    sm: '8',  // 2rem (32px)
    medium: '16', // 4rem (64px)
    lg: '24', // 6rem (96px)
    xl: '32', // 8rem (128px)
  };
  return map[val] || '0';
}

function hexToRgba(hex: string, opacity: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return hex;
}

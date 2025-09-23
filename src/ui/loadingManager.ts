export class LoadingManager {
  private static readonly LOADING_ID = 'loading-circle-animation';
  private static readonly STYLE_ID = 'loading-circle-animation-style';

  /**
   * ローディングアニメーションを開始
   */
  static startLoading(): void {
    this.createStyle();
    this.createLoadingElement();
  }

  /**
   * ローディングアニメーションを停止
   */
  static stopLoading(): void {
    this.removeElement(`.${this.LOADING_ID}`);
    this.removeElement(`#${this.STYLE_ID}`);
  }

  private static createStyle(): void {
    const css = document.createElement('style');
    css.id = this.STYLE_ID;
    css.media = 'screen';
    css.type = 'text/css';

    const rotateAnimation = [
      `.${this.LOADING_ID} {`,
      'height: 20%;',
      'width: 20%;',
      'animation-timing-function: linear;',
      'animation-name: rotate-circle;',
      'animation-iteration-count: infinite;',
      'animation-duration: 0.75s;',
      'position: fixed;',
      'left: 40%;',
      'top: 40%;',
      '}'
    ].join(' ');

    const keyframes = [
      '@keyframes rotate-circle {',
      '0% { transform: rotate(0deg); }',
      '100% { transform: rotate(360deg); }',
      '}'
    ].join(' ');

    const rules = document.createTextNode([rotateAnimation, keyframes].join('\n'));
    css.appendChild(rules);

    document.head.appendChild(css);
  }

  private static createLoadingElement(): void {
    const reactRoot = document.querySelector('#react-root');
    if (!reactRoot) {
      console.warn('React root element not found');
      return;
    }

    const circleArea = document.createElement('div');
    circleArea.classList.add(this.LOADING_ID);

    const svg = this.createSvgElement();
    circleArea.appendChild(svg);
    reactRoot.appendChild(circleArea);
  }

  private static createSvgElement(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('viewBox', '0 0 32 32');

    // 背景円
    const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    backgroundCircle.setAttribute('cx', '16');
    backgroundCircle.setAttribute('cy', '16');
    backgroundCircle.setAttribute('fill', 'none');
    backgroundCircle.setAttribute('r', '14');
    backgroundCircle.setAttribute('stroke-width', '4');
    backgroundCircle.style.cssText = 'stroke: rgb(29, 161, 242); opacity: 0.2;';

    // 回転円
    const rotatingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rotatingCircle.setAttribute('cx', '16');
    rotatingCircle.setAttribute('cy', '16');
    rotatingCircle.setAttribute('fill', 'none');
    rotatingCircle.setAttribute('r', '14');
    rotatingCircle.setAttribute('stroke-width', '4');
    rotatingCircle.style.cssText = 'stroke: rgb(29, 161, 242); stroke-dasharray: 80; stroke-dashoffset: 60;';

    svg.appendChild(backgroundCircle);
    svg.appendChild(rotatingCircle);

    return svg;
  }

  private static removeElement(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.remove();
    }
  }
}
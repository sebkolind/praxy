import { updateAttribute } from './attributes';
import { TentElement } from './types';
import { cleanupComponent } from './utils';

function walker(oldNode: TentElement, newNode: TentElement, nested = false) {
  if (oldNode.isEqualNode(newNode)) {
    return;
  }

  if (oldNode.tagName !== newNode.tagName) {
    oldNode.replaceWith(newNode);

    return;
  }

  const nc = Array.from(newNode.childNodes, (n) => n);
  const oc = Array.from(oldNode.childNodes, (n) => n);

  if (oldNode.nodeType === Node.TEXT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }

    return;
  }

  if (oldNode.$tent == null || newNode.$tent == null) {
    oldNode.replaceWith(newNode);

    return;
  }

  const oldAttributes = oldNode.attributes;
  const newAttributes = newNode.attributes;

  for (let i = 0; i < newAttributes.length; i++) {
    const newAttr = newAttributes[i];
    const oldAttr = oldAttributes.getNamedItem(newAttr.name);

    if (!oldAttr || oldAttr.value !== newAttr.value) {
      updateAttribute(oldNode, newAttr.name, newAttr.value);
    }
  }

  for (let i = 0; i < oldAttributes.length; i++) {
    const oldAttr = oldAttributes[i];
    if (!newNode.hasAttribute(oldAttr.name)) {
      oldNode.removeAttribute(oldAttr.name);
    }
  }

  if (oc.length === 0 && nc.length === 0) return;
  if (oldNode.$tent?.keep) return;

  if (oldNode.$tent.component && !nested) {
    if (oldNode.$tent.view !== newNode.$tent.view) {
      cleanupComponent(oldNode);
      oldNode.replaceWith(newNode);

      return;
    }
  }

  for (let i = 0; i < Math.max(oc.length, nc.length); i++) {
    if (oc[i] == null && nc[i] != null) {
      oldNode.append(nc[i]);
    } else if (oc[i] != null && nc[i] == null) {
      oc[i].remove();
    }
  }

  for (let i = 0; i < oc.length; i++) {
    const oChild = oc[i];
    const nChild = nc[i];

    if (nChild == null) continue;

    walker(oChild, nChild);
  }
}

export { walker };

import { updateAttribute } from './attributes';
import { TentElement } from './types';
import { cleanupComponent } from './utils';

function walker(oldNode: TentElement, newNode: TentElement, nested = false) {
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

  const attributes = newNode.$tent.attributes;
  if (attributes != null) {
    attributes.forEach((key) => {
      if (key in oldNode) {
        if (oldNode[key] !== newNode[key]) {
          oldNode[key] = newNode[key];
        }

        return;
      }

      const oldValue = oldNode.getAttribute(key);
      const newValue = newNode.getAttribute(key);

      if (newValue == null) {
        oldNode.removeAttribute(key);

        return;
      }

      if (oldValue !== newValue) {
        updateAttribute(oldNode, key, newNode.getAttribute(key));
      }
    });
  }

  if (oc.length === 0 && nc.length === 0) return;
  if (oldNode.$tent?.keep) return;

  if (
    !nested &&
    oldNode.$tent.component &&
    newNode.$tent.component &&
    'state' in oldNode.$tent.component &&
    'state' in newNode.$tent.component
  ) {
    if (oldNode.$tent.component.state !== newNode.$tent.component.state) {
      cleanupComponent(oldNode);
      oldNode.replaceWith(newNode);
    }

    return;
  }

  for (let i = 0; i < Math.max(oc.length, nc.length); i++) {
    if (oc[i] == null && nc[i] != null) {
      oldNode.append(nc[i]);
    } else if (oc[i] != null && nc[i] == null) {
      oc[i].remove();
    }
  }

  for (let i = 0; i < oc.length; i++) {
    if (nc[i] == null) continue;
    walker(oc[i], nc[i]);
  }
}

export { walker };

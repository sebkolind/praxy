export function L(as, children = [], opts = {}) {
  const {mount, data, ...attributes} = opts;
  const el = document.createElement(as);
  for (const attr in attributes) {
    const a = attributes[attr];
    if (typeof a === 'function') {
      el[attr] = data != null ? a.bind(data) : a;
    } else {
      el.setAttribute(attr, opts[attr]);
    }
  }
  const $data = data
    ? new Proxy(data, {
        get(target, key) {
          return target[key];
        },
        set(target, key, value) {
          const s = Reflect.set(target, key, value);
          render();
          return s;
        },
      })
    : null;
  const render = () => {
    const ch = typeof children === 'function' ? children({data: $data}) : Array.from(children);
    if (el.children.length === 0) {
      el.append(...ch);
      return;
    }
    const t = (ch, compare) => {
      let i = 0;
      for (const child of ch) {
        const dom = compare.children[i];
        if (dom && !dom.isEqualNode(child)) {
          if (dom.children.length === 0) {
            dom.replaceWith(child);
          }
          const domChildren = Array.from(dom.children);
          const childChildren = Array.from(child.children);
          if (childChildren.length > domChildren.length) {
            let j = 0;
            for (const c of childChildren) {
              if (!domChildren[j]) {
                dom.append(c);
              }
              j++;
            }
          }
          if (domChildren.length > childChildren.length) {
            let j = 0;
            for (const c of domChildren) {
              if (!childChildren[j]) {
                for (const attr of c.attributes) {
                  if (attr.name.startsWith('on')) {
                    c[attr.name] = null;
                  }
                }
                c.remove();
              }
              j++;
            }
          }
          t(childChildren, dom);
        }
        i++;
      }
    };
    t(ch, el);
  };
  render();
  if (mount) {
    mount.append(el);
  } else {
    return el;
  }
}

export function R(routes, opts) {
  window.onload = router;
  window.onhashchange = router;
  function router() {
    const hash = window.location.hash;
    let route = null;
    for (const r of routes) {
      if (r.path === hash) {
        route = r;
        break;
      }
    }
    if (route) {
      const app = document.getElementById('app');
      if (!app) {
        throw new Error('No app element found');
      }
      const current = app.children?.[0];
      if (current && !current.isEqualNode(route.component)) {
        current.replaceWith(route.component);
      } else {
        app.append(route.component);
      }
    } else {
      if (opts.fallback) {
        window.location.hash = opts.fallback;
      }
    }
  }
}
window.onload = function({ target: Document }) {
  const OnInit = () => styleSheet({
    html: Document.querySelector('html'),
    body: Document.querySelector('body'),
    create: (element) => onlyCreateElement(element),
  }).controller(() => {
    const resolution = 1280; // Min resolution
    const html = document.querySelector('html'); // Html
    const head = document.querySelector('head'); // Head
    const original = document.querySelector('body'); // Original body
    const body = document.createElement('body'); // Body
    const css = document.createElement('link');
    const icon = document.createElement('link');

    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('href', './css/style.css');
    icon.setAttribute('rel', 'icon');
    icon.setAttribute('href', './img/favico.ico');
    head.appendChild(css);
    head.appendChild(icon);

    window.innerWidth <= Number(resolution)-1
      ? html.removeChild(original) && html.appendChild(body)
      : null;

   // Default message 
    body.innerHTML = `
      <style>
        .resolution {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .anchor {
          margin-top: 20px;
          font-size: 18px;
        }
      </style>

      <div class="resolution">
        <h1>Resolution not supported!</h1>
        <a class="anchor" href="https://www.instagram.com/codansoficial">
          Follow @codans in social medias
        </a>
      </div>
    `;

    window.addEventListener('resize', ({ target }) => {
      if (target.innerWidth >= resolution) {
          html.removeChild(body);
          html.appendChild(original);
      } else if (window.innerWidth <= Number(resolution)-1) {
          html.removeChild(original);
          html.appendChild(body);
      }
    });
  });

  /**
   * function used to streamline the element creation procedure.
   * @param { HTMLElement } element - common HTML element, by default it is a div.
   * @returns Object
   */
  function onlyCreateElement(element) {
    return {
      classList: [],
      elType: element,
      elementByTimes: [],
      times: 1,
      setType(type) {
        this.elType = type;
        return this;
      },
      setClass(...list) {
        this.classList = list;
        return this;
      },
      setTimes(times) {
        this.times = times;
        return this;
      },
      build() {
        if (this.times >= 2) {
          for (let i=this.times;i>=0;i--) {
            if (i>=1) {
              let component = Document.createElement(this.elType??'div');
              let copy = this.classList[this.classList.length-1];
              component.classList.add(...this.classList);
              component.classList.remove(copy);
              component.classList.add(copy.replace(copy, copy+'-'+i));
              this.elementByTimes.push(component);
            }
          }
        }
        if (this.elementByTimes.length>0)
          return this.elementByTimes;
        const component = Document.createElement(this.elType??'div');
        component.classList.add(...this.classList);
        return component;
      }
    }
  }

  /**
   * This will start working after
   * the document is loaded.
   */
  Document.addEventListener('load', OnInit(), {
    once: true,
    passive: false,
  });
}

// Factory
// This role is responsible for sorting and cataloging the items
// Each item is an HTML element that will be created within the project
function factoryBuilder(HTMLContentNative, body) {
  function addUtils({ toInside }) {
    return {
      items: [],
      mount(itemRef) {
        this.items.push({[itemRef]: toInside});
        body.component = body;
        HTMLContentNative.component = toInside;
        return this;
      },
      insideOf(component) {
        if (!component)
        return body.appendChild(toInside);
        component.appendChild(toInside);
        return this;
      }
    }
  }

  // Builder
  return Object.defineProperty(HTMLContentNative, 'build', {
    configurable: true,
    enumerable: true,
    writable: false,
    value(node, callback) {
      const allContentItems = Object.values(HTMLContentNative)
        .filter((value) => typeof value != "function");
      return callback(node, {
        item: allContentItems,
        itemName: Object.keys(allContentItems),
      }, addUtils);
    },
  });
}

// Initialize
function styleSheet({ body, create }) {
  const onSelector = onSelectorManager({});
  const header = createHeader(body);
  const wrapper = createWrapper(body);
  const footer = createFooter(body);

  // Items
  const myHeader = [
    create().setType('header').setClass('trello-brand').build(),
    create().setClass('trello-logo').build(),
  ];

  const myWrapper = [
    create().setClass('section-wrapper').build(),
    create().setClass('account-form').build(),
    create().setClass('login-container').build(),
  ];

  const myFooter = [
    create().setType('footer').setClass('global-footer').build(),
    create().setClass('atlassian-logo').build(),
    create().setClass('background').build(),
  ];

  // Compose elements
  header.build(myHeader, (...content) => {
    return onSelector.add(content, body).header();
  }).mount('header').insideOf(body.component);

  wrapper.build(myWrapper, (...content) => {
    return onSelector.add(content, body).wrapper();
  }).mount('wrapper').insideOf(body.component);

  footer.build(myFooter, (...content) => {
    return onSelector.add(content, body).footer();
  }).mount('footer').insideOf(body.component);

  // Listener
  return Object.defineProperty({}, 'controller', {
    writable: false,
    configurable: true,
    enumerable: true,
    value: (fnController) => fnController(),
  });
}

// Builders
function createHeader(body) {
  const HTMLContentNative = {
    1: body.querySelector(':nth-child(1)'),
  };

  return factoryBuilder(HTMLContentNative, body);
}

function createWrapper(body) {
  const HTMLContentNative = {
    1: body.querySelector(':nth-child(2)'),
    2: body.querySelector(':nth-child(3)'),
  };

  return factoryBuilder(HTMLContentNative, body);
}

// TODO: New bug [for some reason :nth-child is not starting from the root of the body automatically]
function createFooter(body) {
  const HTMLContentNative = {
    1: document.querySelector('body > :nth-child(4)'),
    2: document.querySelector('body > :nth-child(5)'),
    3: document.querySelector('body > :nth-child(6)'),
  }

  return factoryBuilder(HTMLContentNative, body);
}

// Resolve SVG to /download button
function additionalImageFunction(content) {
  let OSName = "Unknown";
  if (navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
  if (navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac";
  if (navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
  if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
  if (navigator.userAgent.indexOf("Android") != -1) OSName = "Android";
  if (navigator.userAgent.indexOf("Like Mac") != -1) OSName = "iOS";

  // Builder
  function sourceVectorBuilder(element, resolve, reject) {
    fetch(element.src).then((data) => {
      data.text().then((text) => {
          const source = document.createElement('i');
          const removeScript = text.substr(text.search('<!-- Code injected by live-server -->'),
            text.search('</script>'));
          source.innerHTML = text.replace(removeScript, '</svg>');
          return resolve({html: source, element});
        }).catch((error) => reject(error));
    }).catch((error) => reject(error));
  }

  /**
   * This promise will read the SVG file into the /img folder
   * and render it into the HTML element of type button.
   */
  if (content[0]?.nodeName) {
    return new Promise((resolve, reject) => {
      content.forEach((element) => {
        if (element.nodeName === 'IMG')
          return sourceVectorBuilder(element, resolve, reject);
        if (element.nodeName === 'A' &&
          element.firstChild.data.search('Baixar para') !== -1)
        element.innerText = `Baixar para ${OSName}`;
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      return sourceVectorBuilder(content, resolve, reject);
    });
  }
}

function createToggleMode() {
  const context = {
    items: [],
    time: {
      default: 0,
      changed: false,
    },
    seems: false,
    component: [],
    to(time) {
      this.time.default = time;
      this.time.changed = true;
      return this;
    },
    document(document) {
      this.component = document;
      return this;
    },
    build(fnCallback) {
      for (const iterator in this.component) {
        if (!this.time.changed) {
          this.items.push(this.items[iterator]);
          this.component[iterator].classList.add(this.items[iterator]);
        }
        if (this.time.changed) {
          if (this.time.default > iterator) {
            this.items.push(this.items[iterator]);
            this.component[iterator].classList.add(this.items[iterator]);
          }
        }
        
        for (const key of this.component[iterator].childNodes) {
          if (fnCallback)
            fnCallback(this.stop, key, Number.parseInt(iterator)+1);
        }
      }
    }
  }

  /**
   * Object responsible for the factory function that will
   * define the type of switch between data.
   */
  return Object.defineProperties(context, {
    stop: {
      configurable: true,
      enumerable: false,
      writable: false,
      value() {
        this.seems = !this.seems;
        return this;
      }
    },
    create: {
      configurable: true,
      enumerable: true,
      writable: false,
      value(...items) {
        this.items = items;
        return this;
      },
    }
  });
}

/**
 * Here are the constructors of all elements
 * belonging to the styleSheet function.
 */
function onSelectorManager(scope) {
  return Object.defineProperty(scope, 'add', {
    configurable: true,
    enumerable: true,
    writable: false,
    value([node, content, next], body) {
      return {
        header() {
          const [header, logo] = node;

          content.item.filter((item) => (
            additionalImageFunction(item)
              .then((data) => (
                body.removeChild(item) &&
                logo.appendChild(data.html) &&
                header.appendChild(logo)
              ))
              .catch((error) => console.error(error))
          ));

          return next({ toInside: header });
        },
        wrapper() {
          const [wrapper, account, container] = node;

          const [title] = content.item.filter((item) => item.nodeName == 'H1');
          const [form] = content.item.filter((item) => item.nodeName == 'FORM');

          title.classList.add('account-title');
          form.classList.add('account-form');

          account.appendChild(title);
          container.appendChild(form);
          account.appendChild(container);
          wrapper.appendChild(account);

          form.querySelector('span').classList.add('login-separator');
          form.querySelectorAll('button').forEach((item) => item.classList.add('oauth-button'));

          return next({ toInside: wrapper });
        },
        footer() {
          const [footer, atlassian, background] = node;

          const [
            logo,
            analytics,
            interactive,
          ] = content.item.filter((item) => item.nodeName == 'IMG');

          analytics.classList.add('left-large');
          interactive.classList.add('right-large');

          atlassian.appendChild(logo);
          background.appendChild(analytics);
          background.appendChild(interactive);
          footer.appendChild(atlassian);
          footer.appendChild(background);

          return next({ toInside: footer });
        },
      };
    },
  });
}

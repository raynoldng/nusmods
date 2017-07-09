
export const testStep = {
  title: 'First Step',
  text: 'Start using the <strong>joyride</strong>',
  selector: '.moreOptions',
  position: 'bottom-left',
  type: 'hover',
  isFixed: true,
  // optional styling
  style: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '0',
    color: '#fff',
    mainColor: '#ff4456',
    textAlign: 'center',
    width: '29rem',
    arrow: {
      display: 'none',
    },
    beacon: {
      offsetX: 10,
      offsetY: 10,
      inner: '#000',
      outer: '#000',
    },
    header: {
      textAlign: 'right',
      // or any style attribute
    },
    main: {
      padding: '20px',
    },
    footer: {
      display: 'none',
    },
    skip: {
      color: '#f04',
    },
    hole: {
      backgroundColor: 'rgba(201, 23, 33, 0.2)',
    },
  },
  // custom params...
  name: 'my-first-step',
  parent: 'MyComponentName',
};

export const testDefaults = {
  title: 'Second Step',
  text: 'Testing Default Options',
  selector: '.moreOptions',
  position: 'bottom-left',
};

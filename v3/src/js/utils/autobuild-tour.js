
export const testStep = {
  title: 'First Step',
  text: 'Start using the <strong>joyride</strong>',
  selector: '#compMods',
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
  step: 2,
  title: 'Second Step',
  text: 'Testing Default Options',
  selector: '#optMods',
  position: 'bottom-left',
};

export const compModsStep = {
  step: 3,
  title: 'Compulsory Modules',
  text: 'Start using the <strong>joyride</strong>',
  selector: '#compMods',
  position: 'bottom-left',
};

export const timetableStep = {
  step: 5,
  title: 'Compulsory Modules',
  text: 'Start using the <strong>blablaride</strong>',
  selector: '#optMods',
  position: 'bottom-left',
  isFixed: true,
};

export const introStep = {
  step: 6,
  title: 'Compulsory Modules',
  text: 'Start using the <strong>introride</strong>',
  selector: '#compMods',
  position: 'bottom-left',
  isFixed: true,
};

export const a = {
  step: 1,
  title: 'Second Step',
  text: 'Testing Default Options',
  selector: '#timetable',
  position: 'bottom-left',
  isFixed: true,
};

export const b = {
  step: 4,
  title: 'Second Step',
  text: 'Testing Default Options',
  selector: '#timetable',
  position: 'bottom-left',
};

const allSteps = [a, testDefaults, compModsStep, b, timetableStep, introStep];

export default allSteps;

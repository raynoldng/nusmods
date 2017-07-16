// @flow

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

export const introStep = {
  title: 'Welcome to NUSMods Auto-Build Feature!',
  text: `The auto-build feature is meant to help NUS students automatically build the perfect timetable for the next
  semester, based on factors like core modules, GE/UE modules, workload etc. that the user can specify.`,
  selector: '#autobuild-link',
  position: 'right',
};

export const compModsStep = {
  title: 'Compulsory Modules',
  text: `First, specify your compuslory modules here. These are the modules you definitely want to include
  in your timetable next semester (e.g. modules offered only in specific semesters that you don't want to
  postpone).`,
  selector: '#compMods',
  position: 'bottom-left',
};

export const optModsStep = {
  title: 'Optional Modules',
  text: `Next, specify your optional modules. You can add as many optional modules as you want - these are
  modules you potentially want to take next semester, but are not sure whether they can fit in your perfect
  timetable (e.g. GE/UE modules)`,
  selector: '#optMods',
  position: 'bottom-left',
};

export const timetableStep = {
  title: 'Timetable',
  text: `The timetable displays your compulsory modules only. Here, you can lock certain lesson slots of
  specified compulsory modules, useful if you want to go for a certain tutor's tutorials, or go for particular
  tutorials/sectionals with your group of friends!`,
  selector: '#timetable',
  position: 'bottom-left',
};

export const switchModesStep = {
  title: 'Switch Modes',
  text: `You can switch between various modes here! Normal Mode allows you to shift lesson slots around,
  Lock Mode allows you to lock slots in place, and Unlock Mode allows you to unlock them! Just tap/click
  to interact! Interactable slots are marked with a round border.`,
  selector: '#mode-switch',
  position: 'left',
};

export const workloadStep = {
  title: 'Workload',
  text: `We're nearing the end now! Select the workload you would like to have next 
  semester:`,
  selector: '#workloadSelect',
  position: 'top-left',
};

export const moreOptionsStep = {
  title: 'Additional Options',
  text: `You can also select additional options in the collapisible below. Just click to expand
  and see the range of options! You can request for a free day in your timetable, or dictate that
  you don't want lessons to start before or end after certain times!`,
  selector: '#moreOptions',
  position: 'top-left',
};

export const generateStep = {
  title: 'Generate Timetable',
  text: `And we're done! Click this button to generate your timetable! The timetable generated
  for you will be displayed in the timetable above, and the optional modules we have selected
  for you shifted to the compulsory section. If you aren't satisfied with your timetable,
  you can Load Previous Options and try again; if you are, you can Port Timetable to Mainpage
  and export it from there!`,
  selector: '#generateTimetable',
  position: 'top-left',
};

const allSteps = [
  introStep,
  compModsStep,
  optModsStep,
  timetableStep,
  switchModesStep,
  workloadStep,
  moreOptionsStep,
  generateStep,
];

export default allSteps;

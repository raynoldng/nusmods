import React from 'react';
import DocumentTitle from 'react-document-title';

export default function AutobuildGuideContainer() {
  return (
    <DocumentTitle title="Auto-build Guide">
      <div className="row">
        <div className="col-md-8 offset-md-1">
          <h2>Guide to using Auto-Build Feature</h2>
          <p>Warning: Locked modules and blocking of lessons before and after certain timings
          are not implemented yet (we are working on it, expect it to be up by mid-July!). Also,
          try refreshing the page if you experience problems generating your timetable.
          </p>
          <p>First, specify the compulsory (the modules you definitely want to be in your timetable)
          and optional modules by adding them from the dropdown menus, and specify intended workload
          (if left empty, the default value is 5).
          </p>
          <p>
          Next, you may choose to block out lessons before or after certain times, and select whether
          you want a free day.
          </p>
          <p>
          The timetable only displays your compulosry modules, and has no impact on the timetable that
          will be generated for you UNLESS you lock certain slots. This is done by selecting Lock Mode
          and clicking on the slots you wish to fix (for example, if I want to take CS2100 Tut 7 with
          my friend, I would shift the Tut slot to 7 in Normal Mode, then switch to Lock Mode to lock
          it in place)
          </p>
          <p>
          &quot;Load Previous Options&quot; loads the most recent state before the user pressed
          &quot;Generate Timetable&quot;, and &quot;Port Timetable to Main&quot; transfers the currently
          displayed modules and slots to the main timetable for exporting purposes.
          </p>
        </div>
      </div>
    </DocumentTitle>
  );
}

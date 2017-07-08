import React from 'react';
import DocumentTitle from 'react-document-title';

export default function AutobuildGuideContainer() {
  return (
    <DocumentTitle title="Auto-build Guide">
      <div className="row">
        <div className="col-md-8 offset-md-1">
          <h2>Disclaimers:</h2>
          <ul>
            <li><p>The auto-build feature does NOT currently check for exam clashes - please
            do a brief self-check after your timetable is generated</p></li>
            <li><p>The Generate Timetable button returns a <em>RANDOM</em> timetable that fits
            the constraints you specify. It does NOT mean there are no other possible ones -
            If you are not satisfied with the timetable generated, either tighten your constraints
            or Load Previous Options and try generating a new one.</p></li>
          </ul>
          <h2>Guide to using Auto-Build Feature</h2>
          <p>Using the Auto-build Feature is easy!
          </p>
          <p>First, specify the compulsory (the modules you definitely want to be in your timetable)
          and optional modules by adding them from the dropdown menus, and specify intended workload
          (if left empty, the default value is 5).
          </p>
          <p>
          Next, under More Options, you may choose to block out lessons before or after certain times,
          and select whether you want a free day.
          </p>
          <p>
          For those who wish to take certain tutorial slots (e.g. planning with their friends), you
          have the option of locking movable lessons in place. Locked slots will definitely be in the
          specified position in the timetable generated. To Lock a lesson slot, simply switch to Lock
          Mode! All lessons are unlocked by default initially, and only compulsory modules are displayed
          on the timetable and can be locked.
          </p>
          <p>
          &quot;Generate Timetable&quot; computes a suitable timetable based on the constraints you
          provided and renders it on the display.
          &quot;Load Previous Options&quot; loads the most recent state before the user pressed
          &quot;Generate Timetable&quot;, and &quot;Port Timetable to Main&quot; transfers the currently
          displayed modules and slots to the main timetable for exporting purposes.
          </p>
          <p>
          This application is mobile friendly, so you can use it on the go too! Everything is done with
          taps and clicks instead of having to drag!
          </p>
        </div>
      </div>
    </DocumentTitle>
  );
}

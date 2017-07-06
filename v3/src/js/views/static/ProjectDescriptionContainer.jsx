import React from 'react';
import DocumentTitle from 'react-document-title';

export default function ProjectDescriptionContainer() {
  return (
    <DocumentTitle title="Project Description">
      <div className="row">
        <div className="col-md-8 offset-md-1">
          <h2>Introduction</h2>
          <p>A feature many users of NUSMods will find useful would be a timetable planner that can output timetables
             from user supplied modules that fulfills certain requirements, such as:</p>
          <ul>
            <li>having one or more free days (a day that has no lessons)</li>
            <li>no lessons during particular timeslots (e.g. no morning lessons)</li>
            <li>picking from a subset of modules (e.g. 7 pick 5) that fulfills the above constraints</li>
          </ul>
          <p>These are problems that can be solved using a constraint solver. Our team, Bay Wei Heng
          and Raynold Ng, are using
           <a href="https://github.com/Z3Prover/z3">&nbsp;z3</a>, a theorem prover by Microsoft research to support the
           aforementioned features.</p>
          <h2>Constraint Solving</h2>
          <p>We have managed to support the following queries:</p>
          <ul>
            <li>Free Day</li>
            <li>Compulsory Modules</li>
            <li>Optional Modules to fill up workload</li>
            <li>Not have lessons start too early or end too late</li>
            <li>Lock certain lesson slots</li>
          </ul>
          {// <img src="http://i.imgur.com/BOl6eP1.png" border="0" alt="perhaps" />
        }
        </div>
      </div>
    </DocumentTitle>
  );
}

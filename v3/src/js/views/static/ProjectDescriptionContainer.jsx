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
            <li>minimal travelling time</li>
            <li>picking from a subset of modules (e.g. 7 pick 5) that fulfills the above constraints</li>
          </ul>
          <p>These are problems that can be solved using constraint solver. Wei Heng and I are thinking of using
           <a href="https://github.com/Z3Prover/z3">z3</a>, a theorem prover by Microsoft research to support the
           aforementioned features.</p>
          <h1>Constraint Solving</h1>
          <p>We managed to support the following queries:</p>
          <ul>
            <li>Having one or more free days by picking m out n user supplied mods</li>
            <li>Picking from a set of compulsory mods and optional mods</li>
          </ul>
          <p>A CLI-based prototype is available at{' '}
            <a href="https://github.com/raynoldng/nusmods-planner">nusmods-planner</a></p>
          <h2>Internal Representation</h2>
          <p>We currently represent the timetable as hourly slots every 2 weeks (excluding weekends). This is equivalent
           to 24 * 5
          * 2 = 240 slots. This is to account for lessons that are on alternating weeks. For example,
           a lecture that is from 8-10
          every Monday would map to [8, 9, 128, 129].</p>
          <p>Each module is represented by a Boolean selector variable, which is
          true in the model returned by z3 if its
           in the timetable. For each module, we extract its lesson types
           (lecture, tutorial, sectional, recitation etc.).
            Due to the fact that different modules have different lesson types, and each lesson type
            can have varying
            hours, we have (integer) variables for each contact hour (per fortnight)
            in the module. For example, a CS2020
            tutorial with 4 hours every 2 weeks will have the variables CS2020_Tut0, ...,  CS2020_Tut3. These
             variables will help us check for timetable clashes. We
            then have boolean selector variables CS2020_Tut_0, ..., CS2020_Tut_10 (exactly one of which
              will be true) to force the
            integer variables into the hours corresponding to the slot timing.</p>
          <h2>Free Day Queries</h2>
          <p>We shall discuss how the free day query is composed. Just kidding LOLOLOLOL.</p>
          <p>In other words, shall we discuss how the free day query is composed?</p>
          <img src="http://i.imgur.com/BOl6eP1.png" border="0" alt="perhaps" />
        </div>
      </div>
    </DocumentTitle>
  );
}

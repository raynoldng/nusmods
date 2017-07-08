import React from 'react';
import DocumentTitle from 'react-document-title';

export default function FaqContainer() {
  return (
    <DocumentTitle title="FAQ">
      <div className="row">
        <div className="col-md-8 offset-md-1">
          <h2>Frequently Asked Questions</h2>
          <hr />
          <h4>I prefer the previous NUSMods UI - why the change?</h4>
          <p>
            The NUSMods team decided to shift to this UI (click to interact instead of dragging) to
            make the application mobile-friendly. Since we intend to integrate our auto-build feature eventually
            with the main site, we have chosen to adopt their philosophy as well.
          </p>

          <p>
            A possibility to look into in future would be to have a Legacy Mode button, but that is not our main
            priority right now
          </p>

          <h4>Why is this particular feature not implemented?</h4>
          <p>
            After our first round of testing, we have received a lot of feedback, including requests to implement
            various additional features that may be useful to students. We have, and are in the midst of adding
            some of these new features, but several design decisions preclude us from implementing some others.
            The section below explains our general philosophy when designing this app, via explanations on why
            specific features were not implemented.
          </p>
          <ul>
            <li><p>Flexibility in blocking out hourly slots</p></li>
            <p>
              We actually successfully implemented both the interface and back-end logic for this, but decided to
              exclude it from the alpha-release as it resulted in a cluttered timetable interface and was unintuitive
              to use. The gains by introducing this was also very small - in general we believe that students will
              not need such fine-grained control, locking slots in place or playing around with the optional modules
              list should be more than enough.
            </p>
            <li><p>Display past bidding stats for different lesson slots</p></li>
            <p>
              Even though the data is publicly avaiable, we want to try to keep the application as minimalistic as
              possible, and feel that the added convenience this feature would yield is not worth the decline in
              general user experience.
            </p>
            <li><p>Display all possible timetables satisfying a given constraint list</p></li>
            <p>
              This is a rather oft-repeated request, but it is computationally impractical to implement. The reason
              why this application is so fast despite having so many options is that we are using a super efficient
              <a href="http://fmv.jku.at/boolector/"> SMT solver</a> which is good at finding a single model
              (solution), but not-so-good at generating distinct solutions. However, we understand having multiple
              timetables to choose from would be useful for bidding, and hence made timetable generation
              as non-deterministic (random) as possible. Just spam the Generate Timetable button a few times until
              you get one that suits you.
            </p>
          </ul>
          <p>Hello</p>

          <p>Check
            <a href="https://myaces.nus.edu.sg/cors/jsp/report/ModuleInfoListing.jsp"> CORS </a>
            for the official timetable data (and see if that module even exists in CORS).
            Only if it differs from NUSMods, then report it to NUSMods, else,
            kindly inform your faculty to update the official sources and NUSMods will reflect the updates respectively.
            If CORS is updated while NUSMods is not,
            give it a day or two for NUSMods to update it via our automatic scripts.
            If NUSMods is still not updated after two days, then there might be a problem.
            Please contact us and we will look into it.
          </p>

          <h4>
            On my faculty website, the exam date for PS3242 is different from the one shown on NUSMods.
            It should be 28th Nov 2016 1pm and not 24th Nov.
          </h4>
          <p>Refer to the answer for the previous question.</p>

          <h4>
            I can add IS1112 into my list of modules but why are there no lectures or tutorial slots after adding them?
          </h4>
          <p>Refer to the answer for the previous question.</p>

          <h4>SE5221 cannot be found on your website, can you update your system?</h4>
          <p>Refer to the answer for the previous question.</p>

          <h4>
            SC3202 is indicated as only available in Sem 1 in NUSMods but
            the FASS module list shows it as available in Sem 2 too?
          </h4>
          <p>Refer to the answer for the previous question.</p>

          <h4>Why is ... ?</h4>
          <p>
            Before we hear the rest of your question, refer to the answer for the previous question.
          </p>

          <hr />

          <p>
            Congratulations for making it to the end!
            If you are still bent on contacting us,
            you may reach us via email at
            nusmods&#123;at&#125;googlegroups[dot]com.
            Please allow up to 90 working days for a reply.
          </p>
        </div>
      </div>
    </DocumentTitle>
  );
}

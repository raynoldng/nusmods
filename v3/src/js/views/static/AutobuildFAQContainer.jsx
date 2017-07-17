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
            <li><p>Allow setting of priorities to options and optional modules</p></li>
            <p>
              Once again, we think that the tradeoff between such fine-grained control and performance/usability
              is not worth it, especially when users can manually do this with what they have now (include the
              options with highest priority first, and if that fails, replace with the next set of options).
            </p>
            <li><p>Show all GE mods from a particular pillar that fit in a timetable</p></li>
            <p>
              Although this is a very valid concern, we do not have the computational power to do this, and
              users who want to clear modules from particular GE pillars are advised to add the most interesting
              GE modules in the optional section and try to generate a timetable, failing which add the next few
              most interesting mods and so on.
            </p>
          </ul>

          <p>
            In summary, proposed features are sometimes not implemented due to design tradeoffs, lack of computational
            power, and priorities. If you think you have some feature that is feasible and useful to a large
            proportion of the student population, feel free to email bayweiheng@gmail.com or raynold.ng24@gmail.com
            (include NUSMods Auto-build in the subject).
          </p>
          {/* <h4>Here&#39;s what we <em>have</em> implemented:</h4>
          <ul>
            <li><p>Button to switch modules from compulsory to optional and vice versa</p></li>
            <li><p>Button to remove all compulosry/optional modules at once</p></li>
            <li><p>Allow specifying of preferred weekdays when selecting free day option</p></li>
          </ul>*/}

          <h4>Can you go back to the previous color scheme? I liked that one better.</h4>
          <p>
            WELL WE LIKE THIS ONE BETTER SO NO. Just kidding, you can change the color scheme in the Settings
            section.
          </p>

          <hr />
        </div>
      </div>
    </DocumentTitle>
  );
}

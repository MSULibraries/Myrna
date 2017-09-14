/*
 *
 * Policies
 *
 */

import React from "react";
import { Container } from "react-grid-system";
import Helmet from "react-helmet";

export class PoliciesPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Container>
        <Helmet
          title="Policies"
          meta={[{ name: "description", content: "Description of Policies" }]}
        />
        <h1>Rental from the Myrna Colley-Lee Costume Collection</h1>
        <div>
          <h2>SHOPPING</h2>
          <ol>
            <li>
              You may pick costumes one of two ways. You may “shop” online or
              you may make an appointment to pull pieces onsite at MSU. All
              rentals must be paid through this site.
            </li>
            <li>
              Unfortunately, we do not have the staff do alterations or pull
              your show for you.
            </li>
            <li>
              We have done our best to provide accurate information about the
              pieces online. If you find any errors, let us know.
            </li>
            <li>
              Many of these pieces are truly vintage pieces. Please take that
              into consideration. Expect some minor flaws with any piece older
              than 20 years. If we are aware of it, we have noted it in the
              listing. Most flaws will not read from stage unless noted.
            </li>
            <li>
              All the measurements listed about the pieces were taken while the
              piece was lying flat. Please note that these are actual garment
              measurements and no ease has been added. You will need to
              calculate appropriate ease before ordering. Take this into
              consideration when choosing garments.
            </li>
          </ol>
        </div>

        <div>
          <h2>ALTERATIONS</h2>
          <ol>
            <li>We are not able to do alterations.</li>
            <li>
              If any alterations must be made to the piece to make it work for
              your production, you must notify Theatre MSU first.
            </li>
            <li>
              All approved alterations must be done in a way that the original
              integrity of the garment is preserved. Under no circumstances will
              any costume be cut, glued or dyed.
            </li>
            <li>
              All approved alterations must be done by hand and reversed before
              returning the costume.
            </li>
            <li>
              If you get a costume and find a repair that needs to be made, let
              us know. We will work with you to make it right.
            </li>
          </ol>
        </div>

        <div>
          <h2>RENTAL</h2>
          <p>
            All costumes are released for two week period. MAKE SURE we have
            your correct first dress date so that we can get them to you on
            time. If you need them for longer, let us know up front and we can
            work out an extended rate.
          </p>
          <ol>
            <li>
              We will send your order in time for your first dress rehearsal
              date. Please make sure we have that date when you place your order
            </li>
            <li>
              We will pay for shipping to you. You pay shipping back to us.
            </li>
            <li>
              All costumes need to be dry cleaned before returning them to us.
            </li>
            <li>
              We will expect costumes within 10 days of your production closing.
            </li>
            <li>
              Any costume returned to use in a damaged condition will be charged
              to your account at replacement value.
            </li>
          </ol>
          <p>
            You hereby agree to return these pieces in the condition in which
            you received them within 10 days of my production closing. You also
            agree to pay for all goods lost, damaged or destroyed. You have read
            and understand all policies pertaining to shopping, alterations and
            rental and agree to abide by them.
          </p>
        </div>
      </Container>
    );
  }
}

export default PoliciesPage;

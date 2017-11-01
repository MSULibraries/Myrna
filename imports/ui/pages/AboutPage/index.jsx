/*
 *
 * AboutPage
 *
 */
import React from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

export class AboutPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Container>
        <Helmet
          title="About"
          meta={[
            {
              name: 'description',
              content: 'Describes Myrna Colley Lee and the costume collection',
            },
          ]}
        />
        <h1> About</h1>

        <h1>THE MYRNA COLLEY-LEE COSTUME COLLECTION</h1>

        <p>
          The Myrna Colley-Lee Costume Collection is a working costume collection housed by Theatre
          MSU in the Department of Communication. This collection was made possible by a generous
          donation from Myrna to serve the theatre community of Mississippi. In addition to the
          rental collection, the Mississippi State University Libraries houses a research collection
          of theatre costumes and antique clothing along with the papers and letters of Myrna
          Colley-Lee. For more information about the research collection, please contact
          <a href="mailto:sp_coll@library.msstate.edu">sp_coll@library.msstate.edu</a>. You should
          also visit Myrna{"'"}s website for more information about her career and current
          activities at
          <a href="http://www.gladragsdesigns.com">Gladrags Designs</a>.
        </p>

        <p>
          MCLCC is not your average e-commerce website. Click
          <a href="/how_to"> here</a> for help on how to use this website.
        </p>
        <h2>Myrna Colley-Lee</h2>
        <img alt="Myrna Colley Lee Headshot" src="images/pages/About/myrna.jpg" />

        <p>
          Myrna Colley-Lee was born in 1941 at Hamlett, N.C. She completed her B.F.A. in art
          education from the Woman{"'"}s College of the University of North Carolina (now The
          University of North Carolina at Greensboro) and studied scene painting and properties at
          Brooklyn College, N.Y. In 1980 she received her M.F.A. in scenic and costume design from
          Temple University, Philadelphia, Penn.
        </p>

        <p>
          Colley Lee{"'"}s work has been featured on both stage and screen. She has done costume
          design for theatre productions such as
          <em>Relativity</em>, <em>The Piano Lesson</em>, and
          <em>Wedding Band: A Love/Hate Story in Black and White</em>. She has acted as costume
          designer, art director, and set designer for film and television. Lately Colley-Lee has
          branched out further into interior design, completing interiors for production company
          Revelations Entertainment and for several homes.
        </p>

        <p>
          Outside design work Colley-Lee serves as a commissioner for the Mississippi Arts
          Commission and is on several boards, including the Charleston Arts and Revitalization
          Effort, Inc., a local civic arts organization; the Rock River Foundation, a philanthropic
          organization for the arts; the Mississippi State University Department of Art; and the
          Gertrude C. Ford Center for the Performing Arts at the University of Mississippi. She is a
          member of the National Museum of Women in the Arts, Washington, D.C., and the Black
          Theatre Network, St. Louis, Mo. She has also held faculty or staff positions at Smith
          College, Northampton, Mass., the Kennedy Center American College Theater Festival,
          Washington, D.C., and the Design and Management Institute of the National Arts Consortium,
          New York, N.Y.
        </p>

        <p>Learn more about Myrna Colley-Lee:</p>

        <ul>
          <li>
            <a href="http://gladragsdesigns.com">GladRags Designs</a>
          </li>
          <li>
            <a href="http://library.msstate.edu/myrna/Designer.asp">
              The Myrna Colley-Lee Exhibit at Mississippi State University Libraries
            </a>
          </li>
        </ul>

        <h2>Costume Donations</h2>

        <p>
          If you have a garment that you think deserves a second life on stage, please email{' '}
          <a href="mailto:mharris@comm.msstate.edu">mharris@comm.msstate.edu</a>.
          <br />
          We are particularly interested in wearable historic garments and ethnic pieces. We do not
          accept donations of weddings or formal gowns.
          <br />
          We are always looking for full men’s suits, hats and dress shoes, pre-World War 2, pretty
          much anything, unique and exotic pieces, women’s shoes accessories and jewelry
          <br />
          All donations need to be in wearable condition to be considered for the collection.
        </p>
      </Container>
    );
  }
}

export default AboutPage;

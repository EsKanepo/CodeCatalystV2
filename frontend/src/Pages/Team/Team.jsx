import "./Team.css";
import { Link } from "react-router-dom";
import teamMembers from "./data/teamMembers";
import TeamCard from "./components/TeamCard";

const Team = () => {
  return (
    <>
      {/* HERO */}
      <header className="team-hero">
        <div className="container text-center">
          <h1>
            <i className="fa-solid fa-users me-2"></i>
            Tim Pengembang
          </h1>
          <p className="lead">
            Daftar anggota kelompok CodeCatalyst beserta peran dan kontribusinya
          </p>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          {/* CARD SECTION */}
          <div className="row g-4 mb-5">
            {teamMembers.map((member, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <TeamCard member={member} />
              </div>
            ))}
          </div>

          {/* TABLE */}
          <div className="table-responsive mb-4">
            <table className="table table-striped align-middle team-table">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIM</th>
                  <th>Tugas</th>
                  <th>Kontak</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((m, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{m.name}</td>
                    <td>{m.nim || "-"}</td>
                    <td>{m.role}</td>
                    <td>
                      {m.email ? (
                        <a href={`mailto:${m.email}`}>{m.email}</a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CONTACT LINK */}
          <p className="mb-5">
            Hubungi kami jika ada saran atau pertanyaan mengenai proyek
            CodeCatalyst. Klik <Link to="/contact"> Contact</Link>.
          </p>

          {/* PHILOSOPHY */}
          <section className="team-philosophy text-center mt-5">
            <h5>
              <i className="fa-solid fa-lightbulb me-2 text-warning"></i>
              Filosofi Tim Catalyst
            </h5>
            <p className="muted-small mx-auto">
              Kami percaya kolaborasi, konsistensi, dan rasa ingin tahu adalah
              kunci menciptakan produk digital yang berkualitas dan bermanfaat.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Team;

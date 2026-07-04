import { useState } from "react";

const TeamCard = ({ member }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card profile-card text-center">
      <img
        src={member.img}
        alt={member.name}
        className="card-img-top mx-auto mt-3 rounded-circle"
      />

      <div className="card-body">
        <h5 className="mb-1">
          <b>{member.name}</b>
        </h5>

        <p className="muted-small">{member.role}</p>

        <button
          type="button"
          className="btn btn-outline-primary btn-sm mt-2"
          onClick={() => setOpen(!open)}
        >
          {open ? "Sembunyikan Detail" : "Lihat Detail"}
        </button>

        {/* DETAIL */}
        {open && (
          <div className="team-detail mt-3 text-start">
            <p>{member.desc}</p>

            <b>Kontribusi:</b>
            <ul>
              {member.contributions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <b>Tools:</b>
            <p>{member.tools.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;

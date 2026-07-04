const CourseTable = () => {
  return (
    <div className="content-card">
      <h3 className="card-title">
        <i className="fa-solid fa-table me-2"></i>
        Modul Ringkas
      </h3>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>No</th>
              <th>Modul</th>
              <th>Durasi</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>HTML</td>
              <td>8 minggu</td>
              <td><span className="badge bg-success">Pemula</span></td>
            </tr>
            <tr>
              <td>2</td>
              <td>CSS</td>
              <td>8 minggu</td>
              <td><span className="badge bg-success">Pemula</span></td>
            </tr>
            <tr>
              <td>3</td>
              <td>JavaScript</td>
              <td>8 minggu</td>
              <td><span className="badge bg-warning">Menengah</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;

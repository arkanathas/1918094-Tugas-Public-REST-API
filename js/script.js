const ApiKey = "edab7a04905542a59bffe61f65415f9c";
const baseUrl = "https://api.football-data.org/v2/";
const leagueId = "2021";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");
const fetchHeader = {
  headers: {
    "X-Auth-Token": ApiKey,
  },
};

function getListTeams() {
  title.innerHTML = "Daftar Tim Liga Primer Inggris";
  fetch(teamEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.teams);
      let teams = "";
      resJson.teams.forEach((team) => {
        teams += `
                <li class="collection-item avatar">
                    <img src="${team.crestUrl}" alt="" class="circle">
                    <span class="title">${team.name}</span>
                    <p>Berdiri: ${team.founded} <br>
                       Markas: ${team.venue}
                    </p>
                    <a href="#" data-id="${team.id}" class="secondary-content"><i class="material-icons" data-id ="${team.id}" >info</i></a>
                </li>
                `;
      });
      contents.innerHTML = '<ul class="collection">' + teams + "</ul>";
      const detail = document.querySelectorAll(".secondary-content");
      detail.forEach((btn) => {
        btn.onclick = (event) => {
          ShowTeamDetail(event.target.dataset.id);
        };
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function ShowTeamDetail(id) {
  let url = baseUrl + "teams/" + id;
  fetch(url, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.area.name);

      contents.innerHTML = `
            <div class="col s12 m7">
             <h2 class="header">${resJson.name}</h2>
                <div class="card-image">
                <img src="${resJson.crestUrl}" alt="" class="circle">
                    <div class="card-stacked">
                      <div class="card-content">
                        <p>Nama         : ${resJson.name} <br>
                           Nama Pendek  : ${resJson.shortName} <br>
                           Singkatan    : ${resJson.tla} <br>
                           Alamat       : ${resJson.address} <br>
                           Phone        : ${resJson.phone} <br>
                           Website      : ${resJson.website} <br>
                           Email        : ${resJson.email} <br>
                           Berdiri      : ${resJson.founded} <br>
                           Warna Klub   : ${resJson.clubColors} <br>
                           Stadion      : ${resJson.venue} <br>
                        </p>
                      </div>
                    </div>
            </div>
            `;
      title.innerHTML = "Detail Team";
    })
    .catch((err) => {
      console.error(err);
    });
}

function getListStandings() {
  title.innerHTML = "Klasemen Sementara Liga Primer Inggris";
  fetch(standingEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.standings[0]);
      let teams = "";
      let i = 1;
      resJson.standings[0].table.forEach((team) => {
        teams += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px"></td>
                    <td>${team.team.name}</td>
                    <td>${team.playedGames}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.points}</td>
                </tr>
                `;
        i++;
      });
      contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th></th>
                            <th>Nama Tim</th>
                            <th>PG</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                        </thead>
                        <tbody>
                            ${teams}
                        </tbody>
                    </table>
                </div>
            `;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getListMatches() {
  title.innerHTML = "Jadwal Pertandingan Liga Primer Inggris";
  fetch(matchEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.matches);
      let matchs = "";
      let i = 1;
      resJson.matches.forEach((match) => {
        let d = new Date(match.utcDate).toLocaleDateString("id");
        let scoreHomeTeam =
          match.score.fullTime.homeTeam == null
            ? 0
            : match.score.fullTime.homeTeam;
        let scoreAwayTeam =
          match.score.fullTime.awayTeam == null
            ? 0
            : match.score.fullTime.awayTeam;
        matchs += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr>
                `;
        i++;
      });
      contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th>Peserta</th>
                            <th>Tanggal</th>
                            <th>Skor Akhir</th>
                        </thead>
                        <tbody>
                            ${matchs}
                        </tbody>
                    </table>
                </div>
            `;
    })
    .catch((err) => {
      console.error(err);
    });
}

function loadPage(page) {
  switch (page) {
    case "teams":
      getListTeams();
      break;
    case "standings":
      getListStandings();
      break;
    case "matches":
      getListMatches();
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);

  document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
    elm.addEventListener("click", (evt) => {
      let sideNav = document.querySelector(".sidenav");
      M.Sidenav.getInstance(sideNav).close();
      page = evt.target.getAttribute("href").substr(1);
      loadPage(page);
    });
  });
  var page = window.location.hash.substr(1);
  if (page === "" || page === "!") page = "teams";
  loadPage(page);
});
export function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

const CARD_CSS=`
.team-card,.team-card *{
  box-sizing:border-box;
  font-family:"Noto Sans KR",sans-serif;
}

.team-card{
  width:250px;
  height:150px;
  overflow:hidden;
  position:relative;
  border:1px solid var(--card-border);
  border-radius:14px;
  background:#fff;
  box-shadow:0 5px 16px rgba(15,23,42,.06);
  color:var(--card-text);
}

.team-card__top-line{
  display:block;
  width:100%;
  height:4px;
  background:var(--card-top);
}

.team-card__main{
  height:76px;
  display:flex;
  align-items:flex-end;
  gap:11px;
  padding:8px 13px 8px 9px;
}

.team-card__emblem-box{
  width:56px;
  height:56px;
  flex:0 0 56px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:1px solid var(--card-emblem-border);
  border-radius:13px;
  background:#fff;
}

.team-card__emblem{
  width:44px;
  height:44px;
  object-fit:contain;
}

.team-card__info{
  flex:1;
  min-width:0;
  padding-bottom:1px;
}

.team-card__league{
  display:block;
  margin:0 0 2px;
  font-size:8px;
  line-height:1.2;
  font-weight:800;
  letter-spacing:.12em;
  color:var(--card-label);
}

.team-card__name{
  margin:0;
  font-size:16px;
  line-height:1.15;
  font-weight:800;
  color:var(--card-text);
}

.team-card__ranking{
  display:flex;
  align-items:baseline;
  gap:5px;
  margin-top:5px;
}

.team-card__ranking span{
  font-size:10px;
  color:#64748b;
}

.team-card__ranking strong{
  font-size:17px;
  line-height:1;
  font-weight:850;
  color:var(--card-rank);
}

.team-card__next{
  height:61px;
  margin:0 9px 9px;
  padding:7px 11px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:10px;
  border:1px solid var(--card-next-border);
  border-radius:11px;
  background:var(--card-next-bg);
}

.team-card__next-label{
  font-size:9px;
  line-height:1;
  font-weight:800;
  letter-spacing:.1em;
  color:var(--card-label);
}

.team-card__next-info{
  display:flex;
  align-items:center;
  gap:10px;
  width:100%;
  white-space:nowrap;
}

.team-card__date{
  font-size:12px;
  line-height:17px;
  font-weight:750;
  color:var(--card-date);
}

.team-card__opponent{
  font-size:13px;
  line-height:17px;
  font-weight:850;
  color:var(--card-text);
}

.team-card__location{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:44px;
  height:17px;
  padding:0 7px;
  border-radius:999px;
  font-size:9px;
  line-height:1;
  font-weight:850;
}

.team-card__location--home{
  color:var(--card-home-text);
  background:var(--card-home-bg);
  border:1px solid var(--card-home-border);
}

.team-card__location--away{
  color:var(--card-away-text);
  background:var(--card-away-bg);
  border:1px solid var(--card-away-border);
}

.team-card__next--empty{
  display:flex;
  align-items:center;
  justify-content:flex-start;
  font-size:10px;
  color:#64748b;
}
`;

function themeStyle(theme){
  return[
    `--card-border:${theme.border}`,
    `--card-top:${theme.top}`,
    `--card-emblem-border:${theme.emblemBorder}`,
    `--card-text:${theme.text}`,
    `--card-label:${theme.label}`,
    `--card-rank:${theme.rank}`,
    `--card-next-border:${theme.nextBorder}`,
    `--card-next-bg:${theme.nextBackground}`,
    `--card-date:${theme.date}`,
    `--card-home-text:${theme.home.text}`,
    `--card-home-bg:${theme.home.background}`,
    `--card-home-border:${theme.home.border}`,
    `--card-away-text:${theme.away.text}`,
    `--card-away-bg:${theme.away.background}`,
    `--card-away-border:${theme.away.border}`
  ].join(";");
}

export function renderTeamCard(config,data){
  const teamName=escapeHtml(data.team?.name??config.defaultName);
  const rank=escapeHtml(data.standing?.rank??"-");
  const nextGame=data.next_game;

  let nextGameHtml=`
<div class="team-card__next team-card__next--empty">
  다음 경기 일정이 없습니다.
</div>`;

  if(nextGame){
    const date=escapeHtml(nextGame.date??"-");
    const opponent=escapeHtml(nextGame.opponent??"-");
    const location=nextGame.home===true?"HOME":"AWAY";

    nextGameHtml=`
<div class="team-card__next">
  <div class="team-card__next-label">NEXT GAME</div>

  <div class="team-card__next-info">
    <span class="team-card__date">${date}</span>
    <strong class="team-card__opponent">${opponent}</strong>
    <span class="team-card__location team-card__location--${location.toLowerCase()}">${location}</span>
  </div>
</div>`;
  }

  return`
<style>${CARD_CSS}</style>

<article class="team-card" style="${themeStyle(config.theme)}">
  <span class="team-card__top-line"></span>

  <div class="team-card__main">
    <div class="team-card__emblem-box">
      <img
        class="team-card__emblem"
        src="${config.emblemUrl}"
        alt="${teamName} 엠블렘"
        loading="lazy"
      >
    </div>

    <div class="team-card__info">
      <span class="team-card__league">${config.league}</span>
      <h2 class="team-card__name">${teamName}</h2>

      <div class="team-card__ranking">
        <span>현재 순위</span>
        <strong>${rank}위</strong>
      </div>
    </div>
  </div>

  ${nextGameHtml}
</article>`.trim();
}

export function renderErrorCard(config){
  return`
<div style="
  width:250px;
  height:150px;
  box-sizing:border-box;
  padding:12px;
  border:1px solid ${config.theme.border};
  border-top:4px solid ${config.theme.errorTop};
  border-radius:14px;
  background:#fff;
  font-family:'Noto Sans KR',sans-serif;
  color:#64748b;
">
  ${config.defaultName} 정보를 불러올 수 없습니다.
</div>`.trim();
}
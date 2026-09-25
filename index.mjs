import{
  renderTeamCard,
  renderErrorCard
}from"./team-card.mjs";

const TEAMS={
  samsunglions:{
    apiUrl:"https://api.dalae37.com/sport/kbo/samsunglions",
    emblemUrl:"https://resource.dalae37.com/emblem/samsunglions.png",
    defaultName:"삼성 라이온즈",
    league:"KBO LEAGUE",

    theme:{
      border:"#cddfec",
      top:"#0b5fa5",
      emblemBorder:"#dbe8f2",

      text:"#102a43",
      label:"#668198",
      rank:"#0b5fa5",
      date:"#334155",

      nextBorder:"#dbe8f2",
      nextBackground:"#f7fbfe",

      home:{
        text:"#fff",
        background:"#0b5fa5",
        border:"#0b5fa5"
      },

      away:{
        text:"#0b5fa5",
        background:"#fff",
        border:"#0b5fa5"
      },

      errorTop:"#0b5fa5"
    }
  },

  fcseoul:{
    apiUrl:"https://api.dalae37.com/sport/kleague/fcseoul",
    emblemUrl:"https://resource.dalae37.com/emblem/fcseoul.png",
    defaultName:"FC서울",
    league:"K LEAGUE 1",

    theme:{
      border:"#d9d9d9",

      top:"linear-gradient(90deg,#111 0 42%,#c8102e 42% 84%,#c9a34a 84% 100%)",

      emblemBorder:"#ddd6c4",

      text:"#111",
      label:"#7d6330",
      rank:"#c9a34a",
      date:"#2f2f2f",

      nextBorder:"#e3e3e3",
      nextBackground:"#fafafa",

      home:{
        text:"#fff",
        background:"#c8102e",
        border:"#c8102e"
      },

      away:{
        text:"#fff",
        background:"#111",
        border:"#111"
      },

      errorTop:"#c8102e"
    }
  }
};

async function render(config){
  try{
    const response=await fetch(config.apiUrl,{
      method:"GET",
      headers:{Accept:"application/json"},
      signal:AbortSignal.timeout(5000)
    });

    if(!response.ok){
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data=await response.json();

    return{
      statusCode:200,
      headers:{
        "Content-Type":"text/html; charset=utf-8",
        "Cache-Control":"public, max-age=300"
      },
      body:renderTeamCard(config,data)
    };
  }catch(error){
    console.error(`Failed to render ${config.defaultName}:`,error);

    return{
      statusCode:500,
      headers:{
        "Content-Type":"text/html; charset=utf-8",
        "Cache-Control":"no-store"
      },
      body:renderErrorCard(config)
    };
  }
}

export const handler=async(event)=>{
  const teamId=event.queryStringParameters?.team?.toLowerCase();

  if(!teamId){
    return{
      statusCode:400,
      headers:{
        "Content-Type":"text/plain; charset=utf-8",
        "Cache-Control":"no-store"
      },
      body:"team parameter is required"
    };
  }

  const config=TEAMS[teamId];

  if(!config){
    return{
      statusCode:404,
      headers:{
        "Content-Type":"text/plain; charset=utf-8",
        "Cache-Control":"no-store"
      },
      body:`Unknown team: ${teamId}`
    };
  }

  return render(config);
};
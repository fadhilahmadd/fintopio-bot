const readlineSync = require('readline-sync');
const {
  fetchReferralData,
  claimFarming,
  startFarming,
  fetchTasks,
  startTask,
  claimTask,
  dailyCheckin,
  fetchDiamond,
  claimDiamond,
} = require('./api');
const { displayHeader, createTable } = require('./display');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const moment = require('moment');

async function automaticFlow(BEARERS) {
  while (true) {
    try {
      console.log('📅 Auto daily check-in...'.yellow);
      await handleDailyCheckin(BEARERS);

      console.log('\n💎 Auto cracking diamond...'.yellow);
      await handleDiamond(BEARERS);

      console.log('\n🌱 Auto farming...'.yellow);
      await handleFarming(BEARERS);
    } catch (error) {
      console.log(`❌ Error in automatic flow: ${error.message}`.red);
    }

    console.log('\n⏳ Waiting 30 minutes before the next run...'.yellow);
    await delay(30 * 60 * 1000);
  }
}

async function handleAllTasks(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    const tasks = await fetchTasks(BEARER);

    if (tasks) {
      console.log(`#️⃣ ${index + 1} Account:`);

      for (const item of tasks.tasks) {
        if (item.status === 'available') {
          console.log(`🚀 Starting '${item.slug}' task...`.yellow);

          const startedTask = await startTask(BEARER, item.id);

          if (startedTask.status === 'verifying') {
            console.log(`✔️ Task "${item.slug}" started!`.green);

            console.log(`🛠 Claiming ${item.slug} task...`.yellow);
            const claimedTask = await claimTask(BEARER, item.id);

            await delay(1000);

            if (claimedTask) {
              console.log(
                `✔️ Task "${item.slug}" claimed! Congrats! 🎉 `.green
              );
            }
          }
        } else {
          console.log(`🛠 Claiming ${item.slug} task...`.yellow);

          const claimedTask = await claimTask(BEARER, item.id);
          await delay(1000);

          if (claimedTask) {
            console.log(`✔️ Task "${item.slug}" claimed! Congrats! 🎉 `.green);
          }
        }
      }
    }
  }
}

async function handleDiamond(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`#️⃣ ${index + 1} Account:`);

    try {
      const getDiamondo = await fetchDiamond(BEARER);

      if (getDiamondo.state === 'unavailable') {
        console.log(
          `❌ Your diamond is not available, please try again on ${moment(
            getDiamondo.timings.nextAt
          ).format('MMMM Do YYYY, h:mm:ss a')}`.red
        );
      } else {
        console.log(`Please wait, we will crack the diamond...`.yellow);
        await delay(1000);
        await claimDiamond(BEARER, getDiamondo.diamondNumber);

        console.log(
          `Diamond has been cracked! You get ${getDiamondo.settings.totalReward} 💎`
            .green
        );
      }
    } catch (error) {
      console.log(
        `❌ Error cracking diamond: ${error.response?.data ? error.response.data.message : error.message
          }`.red
      );
    }
    await delay(500);
  }
}

async function handleDailyCheckin(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`#️⃣ ${index + 1} Account:`);

    const checkinData = await dailyCheckin(BEARER);

    if (checkinData.claimed) {
      console.log(`✔️ Daily check-in successful!`.green);
    } else {
      console.log(
        `📅 You've already done the daily check-in. Try again tomorrow!`.red
      );
    }

    console.log(`📅 Total daily check-ins: ${checkinData.totalDays}`.green);
    console.log(`💰 Daily reward: ${checkinData.dailyReward}`.green);
    console.log(`💵 Balance after check-in: ${checkinData.balance}`.green);
  }
}

async function handleFarming(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`#️⃣ ${index + 1} Account:`);

    try {
      const farm = await claimFarming(BEARER);

      if (farm) {
        console.log(`🌱 Farming started!`.green);
        console.log(
          `🌱 Start time: ${moment(farm.timings.start).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}`.green
        );
        console.log(
          `🌾 End time: ${moment(farm.timings.finish).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}`.green
        );
      }
    } catch (error) {
      if (error.response?.data?.message.includes('not finished yet')) {
        console.log(
          `⚠️ Farming not finished yet, attempting to start new farming...`
            .yellow
        );

        const reFarm = await startFarming(BEARER);

        if (reFarm) {
          console.log(`🌱 Re-farming started!`.green);
          console.log(
            `🌱 Start time: ${moment(reFarm.timings.start).format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`.green
          );
          console.log(
            `🌾 End time: ${moment(reFarm.timings.finish).format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`.green
          );
        }
      } else {
        console.log(
          `❌ Error handling farming: ${error.response?.data?.message || error.message
            }`.red
        );
      }
    }
  }
}

async function handleTasks(BEARERS) {
  displayHeader();
  console.log(`🚀 Fetching data, please wait...\n`.yellow);

  const table = await createTable(BEARERS, fetchReferralData);
  console.log(table);

  console.log('Starting automatic flow...'.cyan);
  await automaticFlow(BEARERS);
}

module.exports = {
  handleTasks,
};

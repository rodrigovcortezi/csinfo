const PrismaClient = require('@prisma/client').PrismaClient
const moment = require('moment-timezone')

const updateQuery = (match) => {
  const { team1: t1, team2: t2, date, meta } = match
  const team1 = t1
    ? {
        connectOrCreate: {
          where: {
            hltvId: t1.hltvId,
          },
          create: {
            ...t1,
          },
        },
      }
    : {
        disconnect: true,
      }

  const team2 = t2
    ? {
        connectOrCreate: {
          where: {
            hltvId: t2.hltvId,
          },
          create: {
            ...t2,
          },
        },
      }
    : {
        disconnect: true,
      }

  return {
    team1,
    team2,
    date,
    meta,
  }
}

const createQuery = (match) => {
  const { team1: t1, team2: t2, event: e } = match
  const team1 = t1
    ? {
        connectOrCreate: {
          where: {
            hltvId: t1.hltvId,
          },
          create: {
            ...t1,
          },
        },
      }
    : undefined
  const team2 = t2
    ? {
        connectOrCreate: {
          where: {
            hltvId: t2.hltvId,
          },
          create: {
            ...t2,
          },
        },
      }
    : undefined
  const event = e
    ? {
        connectOrCreate: {
          where: {
            hltvId: e.hltvId,
          },
          create: {
            ...e,
          },
        },
      }
    : undefined

  return {
    ...match,
    event,
    team1,
    team2,
  }
}

const createOrUpdate = async (matchesData) => {
  const prisma = new PrismaClient()
  const result = []
  for (const match of matchesData) {
    const saved = await prisma.match.upsert({
      where: {
        hltvId: match.hltvId,
      },
      update: updateQuery(match),
      create: createQuery(match),
    })
    result.push(saved)
  }

  return result
}

const findAll = async () => {
  const prisma = new PrismaClient()
  const matches = await prisma.match.findMany()
  return matches
}

const findAllToday = async (filter = null) => {
  const prisma = new PrismaClient()
  const timeZone = 'America/Sao_Paulo'
  const matches = await prisma.match.findMany({
    where: {
      ...filter,
      date: {
        gte: moment().tz(timeZone).subtract(1, 'hour').toDate(),
        lte: moment().tz(timeZone).endOf('day').toDate(),
      },
      team1: {
        isNot: null,
      },
      team2: {
        isNot: null,
      },
    },
    include: {
      team1: true,
      team2: true,
    },
    orderBy: {
      date: 'asc',
    },
  })
  return matches
}

module.exports = {
  createOrUpdate,
  findAll,
  findAllToday,
}

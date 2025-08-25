import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import loginRoute from "./routes/auth/login/route";
import registerRoute from "./routes/auth/register/route";
import nearbyStationsRoute from "./routes/stations/nearby/route";
import stationStatusRoute from "./routes/stations/status/route";
import slotBookingRoute from "./routes/booking/slot/route";
import chargingSessionRoute from "./routes/charging/session/route";
import walletRoute from "./routes/wallet/transactions/route";
import profileUpdateRoute from "./routes/profile/update/route";
import emergencyRoute from "./routes/emergency/request/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    login: loginRoute,
    register: registerRoute,
  }),
  stations: createTRPCRouter({
    nearby: nearbyStationsRoute,
    status: stationStatusRoute,
  }),
  booking: createTRPCRouter({
    slot: slotBookingRoute,
  }),
  charging: createTRPCRouter({
    session: chargingSessionRoute,
  }),
  wallet: createTRPCRouter({
    get: walletRoute,
  }),
  profile: createTRPCRouter({
    update: profileUpdateRoute,
  }),
  emergency: createTRPCRouter({
    request: emergencyRoute,
  }),
});

export type AppRouter = typeof appRouter;
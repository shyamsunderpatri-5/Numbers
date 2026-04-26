import { AstroNumerologyService } from '../src/lib/engine/service/astro-numerology-service';

async function debug() {
  const service = new AstroNumerologyService();
  const rBrief = await service.getExpertConsultation({ name: "Suresh Kumar", dob: "1979-04-21", question: "Q", category: "GENERAL" }, "");
  console.log(rBrief.finalPrompt);
}
debug();

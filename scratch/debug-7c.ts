import { AstroNumerologyService } from '../src/lib/engine/service/astro-numerology-service';

async function debug() {
  const service = new AstroNumerologyService();
  const rComp = await service.getCompatibilityReport(
    { name: "Suresh Kumar", dob: "1979-04-21", question: "Q", category: "GENERAL" }, 
    { name: "X", dob: "1980-01-01", question: "Q", category: "GENERAL" }, 
    ""
  );
  console.log(rComp.finalPrompt);
}
debug();

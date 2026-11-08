// Each journey is attempted once. Retire successful browser sessions at a fixed
// boundary; never recover or replay a failed journey in a fresh browser.
export function createJourneyLifecycle({create,verify,maxJourneys=20}) {
 let browser,completed=0,failed=false;
 return {
  async run(journey,work) {
   if(failed)throw Error('Journey lifecycle already failed; no replay allowed');
   try {
    if(browser&&completed===maxJourneys){await verify(browser);await browser.close();browser=undefined;}
    if(!browser){browser=await create();completed=0;}
    await work(browser,journey);completed++;
   } catch(error){failed=true;throw error;}
  },
  async close(){await browser?.close();}
 };
}

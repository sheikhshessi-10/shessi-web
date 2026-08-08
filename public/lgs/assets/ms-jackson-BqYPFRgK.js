const e="ms-jackson",t="City of Jackson: what happens to a bid, stage by stage",a="Portal pedia · 27",s="City of Jackson: the night a tiny board finally opened a bid",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. This is a tiny public city bid board, three to ten rows a night. For 33 nights running it sent nothing to the judge. On this night two bids got through triage for the first time ever, both were read in full, and both came back NO. Reading those two pages also turned up something nobody had checked: the board is not in Mississippi.",o=[{value:"9",label:"in snapshot"},{value:"6",label:"carried over"},{value:"3",label:"new tonight"},{value:"2",label:"triage says open"},{value:"7",label:"triage says skip"},{value:"0",label:"yes"},{value:"2",label:"no"}],i="Every number above is read from data/ms-jackson/daily/2026-07-28/stats.json (448 bytes). The snapshot behind it is data/ms-jackson/bids/all-bids.json (13,065 bytes, 9 rows). Zero MAYBE that night, and verdicts_unresolved: 0. Across all 34 dated folders in data/ms-jackson/daily/, 33 show triage.open = 0. This one shows 2.",r=["Bid A · 651 · BLOOMFIELD PARK TODDLER PLAYGROUND. New tonight, dies at triage.","Bid B · 654 · MLK CIA ENVIRONMENTAL CLEANUP. Travels further than any Jackson bid ever has, and still ends NO at 22."],d=[{n:"0",title:"Is this portal due tonight?",who:"scripts/portal_due.py --batch portals",summary:["This board is checked every third night, not every night. The gate looks at the newest dated folder under data/ms-jackson/daily/. Three days old or older, the slug gets printed and a sweep is sent out. Otherwise nothing happens.","The previous folder was 2026-07-23, five days back, so the gate opened."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the row below"},{path:"data/ms-jackson/daily/",size:"34 dated folders"}],blocks:[],notes:["If the board database cannot be reached, the cadence falls back to this file and the gate never crashes. Evidence: scripts/portal_registry.py:61."],tables:[]},{label:"The real registry row",paths:[],blocks:[`{
 "slug": "ms-jackson",
 "label": "City of Jackson, MS",
 "engine": "civicplus",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Hold on to carry_forward and enrich_passes. Both come back later, and one of them is wrong."],tables:[]}],notes:[],then:"the slug is handed to a helper agent"},{n:"1",title:"A helper agent picks it up",who:"Agent(general-purpose) → /ms-jackson-sweep",summary:["The nightly runner sends this portal out in Batch E, five portals at a time. A helper agent reads the sweep instructions and works through every stage below, then reports one paragraph of numbers back.","If this portal fails, the batch keeps going and the failure is noted. One small city board never blocks the other 46 portals in the portals registry group."],cells:[{label:"In → Out",paths:[{path:".claude/skills/ms-jackson-sweep/SKILL.md",size:"the runbook the agent follows"},{path:"one paragraph of counts, returned to the orchestrator",size:"not a file"}],blocks:[],notes:["The sweep instructions say plainly: this is a public board, do not add a login. Evidence: .claude/skills/ms-jackson-sweep/SKILL.md:13."],tables:[]}],notes:[],then:"one plain web request, no login, no browser"},{n:"2",title:"Pull the list",who:"data/ms-jackson/scripts/run_daily.py · step 1 · engine civicplus",summary:["One anonymous request to cityofjackson.org/Bids.aspx. The page is plain server-made HTML, so each bid row is picked out with pattern matching: the id from the ?bidID= number in the link, the title, the status and the closing date. Anything already past its closing date is dropped.","The list page carries no description at all. Title, status, dates. That is the whole row. Everything else has to be fetched later, one page at a time, and only for bids that survive triage.",'Buyer, agency and state are not read from the page. They are stamped in from our own config.json, which says "name": "City of Jackson, MS" and "state": "MS". Evidence: open folders/_lib/engines/civicplus.py:143-144, 180-188 — read out of the config, stamped onto every row. Remember that. It is the whole reason for the finding at stage 5.'],cells:[{label:"In → Out",paths:[{path:"data/ms-jackson/config.json",size:"slug, name, state, url"},{path:"https://www.cityofjackson.org/Bids.aspx",size:"one GET"},{path:"data/ms-jackson/bids/all-bids.json",size:"13,065 bytes · 9 rows"},{path:"data/ms-jackson/bids/index.json",size:"265 bytes"}],blocks:[`{
 "generated_at": "2026-07-28T20:53:10.760473+00:00",
 "snapshot_total": 9,
 "source": "ms-jackson",
 "engine": "civicplus",
 "endpoint": "https://www.cityofjackson.org/Bids.aspx",
 "http_status": 200,
 "walled_or_empty": false,
 "open_total": 9
}`],notes:[],tables:[]},{label:"Real record Bid A, as pulled",paths:[],blocks:[`{
 "bid_id": "651",
 "bid_no": "",
 "title": "BLOOMFIELD PARK TODDLER PLAYGROUND",
 "buyer": "City of Jackson, MS",
 "agency": "City of Jackson, MS",
 "status": "Open",
 "due_date": "2026-08-12",
 "due_date_raw": "8/12/2026 10:00 AM",
 "posting_date": null,
 "state": "MS",
 "detail_url": "https://www.cityofjackson.org/
 bids.aspx?bidID=651",
 "description": "",
 "_detail_ok": false
}`],notes:["13 fields, empty description, _detail_ok: false. Seven of the nine rows look exactly like this all night."],tables:[]}],notes:['A test row that will not leave. One of the nine is bid_id 210, titled "New Listing - 1001 Lansing Avenue", with "due_date_raw": "Upon Contract" and therefore due_date: null. The rule at open folders/_lib/common.py:79-80 keeps any row with no closing date, so this one can never expire. Its triage reason, in every archive, is the literal string "qa-baseline". A test artefact is sitting in live data and adding one to snapshot_total every single night.'],then:"today's list is compared against the last run"},{n:"3",title:"Work out what is actually new",who:"data/ms-jackson/scripts/run_daily.py · step 2 · ps.prep",summary:["Today's nine rows are compared against the newest previous archive, daily/2026-07-23/triage.json, which held seven ids. A bid seen before keeps its old decision and costs nothing. A bid never seen before is the only thing the AI will be shown.","Six carried over, three were new. Seven prior ids were compared against six carryovers, so one bid that was on the board on 23 July had dropped off it by 28 July.","This is the memory. There is no database behind this portal. Yesterday's archive file is the entire memory of what has already been decided."],cells:[{label:"In → Out",paths:[{path:"data/ms-jackson/bids/all-bids.json",size:"9 rows"},{path:"data/ms-jackson/daily/2026-07-23/triage.json",size:"7 prior decisions"},{path:"runs/triage-input.json",size:"592 bytes · 3 rows"},{path:"runs/triage-carryover.json",size:"719 bytes · 6 rows"},{path:"runs/judge-input.json",size:"4,538 bytes · 9 rows"},{path:"runs/_funnel.json",size:"149 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 9,
 "carryover_count": 6,
 "triage_input_count": 3,
 "prior_archive_ids_compared_against": 7
}`],notes:[],tables:[]},{label:"A real carryover row · triage-carryover.json",paths:[],blocks:[`{
 "idx": 1,
 "bid_id": "649",
 "decision": "SKIP",
 "reason": "single address, electrical install"
}`,`{
 "idx": 4,
 "bid_id": "651",
 "title": "BLOOMFIELD PARK TODDLER PLAYGROUND",
 "buyer": "City of Jackson, MS",
 "state": "MS",
 "due_date": "2026-08-12"
}`],notes:["Bid 649, 626 N EAST ST - ELECTRICAL TO CODE, was decided on an earlier night. Tonight it is re-stamped from this file without any AI call at all. That is where six of tonight's seven SKIPs came from.","Six fields. No description, because none exists yet. The AI decides on a title."],tables:[]}],notes:['A file whose size makes no sense until you know why. judge-input.json holds all nine bids in 4,538 bytes. The file written two stages later holds only two bids in 5,421 bytes. The reason is that this one is built before any detail page has been fetched, so seven of the nine bodies are the empty stub "RFP body (truncated to 6KB):\\n" with nothing after it. It is not a dead file: open folders/_lib/platform_sweep.py:283 reads it back at stage 6. The model doc does not list it as an input there, which is a gap in the model, not in the code.'],then:"three titles go to the AI"},{n:"4",title:"Triage: open it or drop it",who:"Agent max-triage · Pass 1",summary:["The AI reads title, buyer and state for the three new bids and answers OPEN or SKIP. The default answer is SKIP. It only says OPEN for the work LGS actually does, or for a title so vague that a city could be hiding that work inside it.","Bid A is a toddler playground. Dropped. Bid B says cleanup of two lots, and the AI opened it against Jackson lot-clearing history. Bid 652 was opened purely because its title was cryptic, which is exactly what the rule tells it to do.","Two OPENs. This had never happened before. The other 33 archives on disk all record triage.open = 0."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"3 rows"},{path:"runs/triage-verdicts.json",size:"397 bytes · 3 rows"}],blocks:[],notes:["The seven SKIPs are not seven AI calls. Six were copied from the carryover file, one is Bid A. This portal costs almost nothing to run because the memory does most of the work.","Bid A's journey ends here. One title read is its total cost. Nothing will ever fetch its page, and nothing will look at it again except as a carryover line."],tables:[]},{label:"Real records Bid A droppedBid B opened",paths:[],blocks:[`{
 "idx": 4,
 "bid_id": "651",
 "decision": "SKIP",
 "reason": "playground, wrong vertical"
}`,`{
 "idx": 5,
 "bid_id": "654",
 "decision": "OPEN",
 "reason": "multi-lot cleanup, Jackson
 lot-clearing precedent"
}`,`{
 "idx": 6,
 "bid_id": "652",
 "decision": "OPEN",
 "reason": "cryptic MLK CIA municipal
 property maintenance"
}`],notes:[],tables:[]}],notes:[],then:"for the first time, two detail pages get fetched"},{n:"5",title:"Go and read the two pages",who:"ps.enrich_opens(PORTAL, config, open_ids)",summary:["Only bids marked OPEN get their own page fetched. That is where the real closing time, the contact and the full notice live. A SKIP bid never gets any of it.",'Until this night this stage had never once run. The model doc still says so in as many words: "NEVER FIRED. Every archive on record shows triage open=0". The files now say otherwise, and the files win. Two pages were fetched, and two rows in the snapshot grew fields that no ms-jackson row had ever carried: page_text, contact_phone, and a real description.'],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the 2 OPEN ids"},{path:"https://www.cityofjackson.org/bids.aspx?bidID=654",size:"and 652"},{path:"data/ms-jackson/bids/all-bids.json",size:"rewritten in place"}],blocks:[`654 _detail_ok true description 2,262 chars phone 517-768-6060
652 _detail_ok true description 2,168 chars phone 517-768-6060
649 _detail_ok false description 0 chars phone null
648 _detail_ok false description 0 chars phone null
647 _detail_ok false description 0 chars phone null
646 _detail_ok false description 0 chars phone null
651 _detail_ok false description 0 chars phone null
650 _detail_ok false description 0 chars phone null
210 _detail_ok false description 0 chars phone null`],notes:["Neither row came back with a documents key at all. The engine can parse a documents block (civicplus.py:267-292), so either these two notices carry no attachments or the block was not present. Nothing on disk tells us which."],tables:[]},{label:"Real record Bid B, after the fetch",paths:[],blocks:[`{
 "bid_id": "654",
 "title": "MLK CIA ENVIRONMENTAL CLEANUP OF
 BIDDLE & COOPER STREET LOTS",
 "buyer": "City of Jackson, MS",
 "agency": "City of Jackson, MS",
 "state": "MS",
 "status": "Open",
 "due_date": "2026-08-12",
 "due_date_raw": "8/12/2026 1:00 PM",
 "posting_date": "2026-07-27",
 "detail_url": "https://www.cityofjackson.org/
 bids.aspx?bidID=654",
 "contact_phone": "517-768-6060",
 "_detail_ok": true,
 "description": "Bid Title: MLK CIA ENVIRONMENTAL
 CLEANUP OF BIDDLE & COOPER STREET LOTS
 Category: Bid Postings Status: Open
 Description: The City of Jackson for the
 MLK CIA is accepting electronic proposal
 submissions from qualified contractors for
 environmental remediation and site
 restoration activities at two contiguous
 vacant prop…"
}`],notes:[],tables:[]}],notes:['Read the phone number again: 517-768-6060. That is a Michigan area code. Later in the very same description field, verbatim: "at two contiguous vacant properties located at the intersection of Cooper Street and Biddle Avenue in the City of Jackson, Michigan." And at the foot of both pages, verbatim: "Contact Us City Hall 161 W. Michigan Avenue Jackson, Michigan 49201 Phone: 517-768-6060". The ninth row in the snapshot is titled "New Listing - 1001 Lansing Avenue". Seven of the other eight titles on the board name a Jackson, Michigan park or street. Meanwhile data/ms-jackson/config.json says "state": "MS" and "name": "City of Jackson, MS", and the engine stamps that name onto buyer and agency for all nine rows. The board we pull is one city and every field we write says another. Nothing checks the two against each other, which is why 34 archives went by without anyone noticing. Which city this slug was meant to cover, and what should happen to it now, is an operator call, not one this page can make.'],then:"the judge's worklist is cut from the freshly filled snapshot"},{n:"6",title:"Cut the judge's worklist",who:"ps.build_judge_input_open(PORTAL)",summary:["The worklist is tonight's OPENs plus any older OPEN that still has no verdict. Anything already judged is left alone. The nine-row file from stage 3 is read back, the two OPEN rows are picked out of it, and their bodies are rebuilt from the snapshot that stage 5 just filled. That is why this file is bigger than the nine-row one."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the OPENs"},{path:"runs/triage-carryover.json",size:"older unjudged OPENs, none tonight"},{path:"runs/judge-input.json",size:"read back at platform_sweep.py:283"},{path:"data/ms-jackson/bids/all-bids.json",size:"now enriched"},{path:"runs/judge-input-open.json",size:"5,421 bytes · 2 rows"}],blocks:[],notes:["Here is where the Michigan text reaches the AI. Our own header says Buyer: City of Jackson, MS and State: MS. The body pasted underneath it says Michigan. The judge is handed both, in one string, and is the first thing in the whole pipeline that gets to see the contradiction."],tables:[]},{label:"Real record Bid B · judge-input-open.json",paths:[],blocks:[`{
 "idx": 5,
 "bid_id": "654",
 "title": "MLK CIA ENVIRONMENTAL CLEANUP OF
 BIDDLE & COOPER STREET LOTS",
 "buyer": "City of Jackson, MS",
 "state": "MS",
 "due_date": "2026-08-12",
 "detail_url": "https://www.cityofjackson.org/
 bids.aspx?bidID=654",
 "description_full": "Title: MLK CIA ENVIRONMENTAL
 CLEANUP OF BIDDLE & COOPER STREET LOTS
 Buyer: City of Jackson, MS
 State: MS
 Closes: 2026-08-12
 Source URL: https://www.cityofjackson.org/
 bids.aspx?bidID=654

 RFP body:
 Bid Title: MLK CIA ENVIRONMENTAL CLEANUP OF
 BIDDLE & COOPER STREET LOTS … environmental
 remediation and site restoration activities
 at two contiguous vacant properties located
 at the intersection of Cooper Street and
 Biddle Avenue in the City of Jackson,
 Michigan. … Contact Us City Hall 161 W.
 Michigan Avenue Jackson, Michigan 49201
 Phone: 517-768-6060 …"
}`],notes:[],tables:[]}],notes:[],then:"two full notices are scored"},{n:"7",title:"The judge, running here for the first time",who:"Agent max-bid-judge · Pass 2",summary:["The AI reads the full notice for each OPEN bid and returns a verdict, a score out of 100, one line of reasoning and a list of warning flags.","Two bids in. Two NO out, at 22 and 12. The reasoning is sound in both cases: one is licensed contaminated-soil removal with permits and manifests, which is a different trade from storm and vegetation debris. The other is hiring an office to administer a property portfolio, with no mowing or clearing language anywhere in it."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"2 rows"},{path:"runs/judge-verdicts.json",size:"1,493 bytes · 2 rows"}],blocks:[],notes:["Look at the first red flag on both bids: out_of_core_state. Mississippi is one of LGS's core states, and every field our pipeline wrote says MS. The only place the word Michigan appears anywhere in this run is inside the body text the judge was handed. The judge flagged the geography correctly, for a reason nothing upstream had noticed, and the flag then sat quietly inside a NO verdict where nobody was going to read it. This is the one place the whole pipeline came within one line of catching the mistake."],tables:[]},{label:"Real records Bid B ends NO at 22",paths:[],blocks:[`{
 "bid_id": "654",
 "title": "MLK CIA ENVIRONMENTAL CLEANUP OF
 BIDDLE & COOPER STREET LOTS",
 "verdict": "no",
 "score": 22,
 "primary_reason": "Licensed environmental
 remediation, not LGS debris work -
 contaminated soil mounds and buried
 construction fill hauled to a regulated
 disposal facility under federal/state rules;
 hazmat excavation trade with permits/
 manifests. Not storm or vegetative debris.
 No remediation precedent in 773-bid
 history.",
 "red_flags": [
 "out_of_core_state",
 "environmental_remediation_specialty",
 "hazmat_licensing_and_permits_required",
 "not_vegetative_or_storm_debris",
 "low_scale_inferred_single_site",
 "no_precedent_in_773_bid_history"
 ]
}`,`{
 "bid_id": "652",
 "title": "MLK CIA PROPERTY MANAGEMENT
 SERVICES",
 "verdict": "no",
 "score": 12,
 "primary_reason": "Hiring a professional property
 management firm to administer a real-estate
 portfolio - leasing, tenant and asset admin.
 'Maintain its inventory of selected
 properties' means managing the inventory,
 not mowing it; no mowing, grounds,
 landscaping, vegetation, clearing, tree or
 debris language anywhere in the body. Wrong
 vertical.",
 "red_flags": [
 "out_of_core_state",
 "wrong_vertical_real_estate_
 administration",
 "no_vegetation_or_grounds_language_
 in_scope",
 "professional_services_firm_not_
 field_crews",
 "no_precedent_in_773_bid_history"
 ]
}`],notes:[],tables:[]}],notes:[],then:"the night is written down"},{n:"8",title:"Write the archive, and remember for next time",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover decisions and tonight's decisions are merged. Tonight's verdicts are folded on top of every earlier verdict whose bid is still on the board. Key names are tidied so both spellings are filled. Then five files are written into tonight's folder plus a row in the running index.","This is also the carry-forward for this portal. There is no separate rescue script. Memory happens right here, inside the sweep, in compile_archive at platform_sweep.py:393-415."],cells:[{label:"Out · data/ms-jackson/daily/2026-07-28/",paths:[],blocks:[],notes:['The name new-bids.json is a lie. Three bids were new tonight. This file has nine rows and is byte-for-byte identical to bids/all-bids.json, both 13,065 bytes. It is the whole snapshot under a name that says otherwise, and it carries the enriched page_text along with it. Anything downstream that trusts the name to mean "new" will over-count this portal.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["triage.json","all 9 decisions, tomorrow's memory","1,113 bytes"]},{header:!1,cells:["verdicts.json","2 verdicts, both NO","1,617 bytes"]},{header:!1,cells:["new-bids.json","9 rows","13,065 bytes"]},{header:!1,cells:["stats.json","the funnel counts","448 bytes"]},{header:!1,cells:["report.md","human summary","414 bytes"]}]]},{label:"Real record Bid B · daily verdicts.json",paths:[],blocks:[`{
 "bid_id": "654",
 "title": "MLK CIA ENVIRONMENTAL CLEANUP OF
 BIDDLE & COOPER STREET LOTS",
 "verdict": "no",
 "score": 22,
 "primary_reason": "Licensed environmental
 remediation, not LGS debris work …",
 "red_flags": ["out_of_core_state", …],
 "bid_key": "ms-jackson:654",
 "would_lgs_bid": "no"
}`,`{
 "bid_id": "210",
 "decision": "SKIP",
 "reason": "qa-baseline"
}`],notes:["Two fields were added on the way in: bid_key and would_lgs_bid. That is the tidy-up step, so a reader that wants either spelling finds one.","No idx like every other row has. It was written by hand once and has been copied forward ever since."],tables:[]}],notes:[],then:"the portal's own night is over, the shared machinery takes over"},{n:"9",title:"Carry forward: switched off here, but it has run anyway",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Across the whole system there is a safety net that rescues verdicts for bids that fell out of one night's pull. It builds its list only from registry rows whose carry_forward is "orchestrator". This portal's row says "engine-internal", so on a normal night the script leaves it alone.`,"In plain terms: this portal does its own remembering, at stage 8, and the shared safety net is meant to stay off. Running both would merge the same prior verdicts a second time on top of a merge that already happened.",'The model doc says the script "never touches it". Disk disagrees. The script leaves an audit file behind whenever it runs against a portal, and two of those files exist here.'],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:'carry_forward: "engine-internal"'},{path:"nothing written on 2026-07-28",size:"no audit file in tonight's folder"}],blocks:[],notes:["No harm was done, and that is luck rather than design. Every count in both audit files is zero, because this portal had no verdicts to carry. Had there been any, they would have been merged twice. The double-merge risk the design guards against was never actually tested.","But two of the 34 folders do contain one: daily/2026-06-09/ and daily/2026-06-23/, 385 bytes each. So the safety net ran against this portal twice in June. The registry says engine-internal today. Why it ran on those two nights is not something any file on disk records."],tables:[]},{label:"Real file · daily/2026-06-09/_carryforward_audit.json, whole",paths:[],blocks:[`{
 "portal": "ms-jackson",
 "today": "2026-06-09",
 "prior_date_used": "2026-06-08",
 "today_new_judged": 0,
 "carried_forward": 0,
 "carried_forward_not_in_today_snapshot": 0,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 0,
 "dropped_closed_award": 0,
 "final_total": 0,
 "final_yes": 0,
 "final_maybe": 0,
 "final_no": 0,
 "max_age_days": 90
}`],notes:["The 2026-06-23 file is the same shape, same 385 bytes, all zeros, prior date 2026-06-22. Neither file carries the ok and skipped keys the script writes today (carry_forward_verdicts.py:200-201), so both were written by an older version of it."],tables:[]}],notes:[],then:"the ledger, the report and the board fixtures are rebuilt"},{n:"10",title:"The ledger, the report, and the board fixture",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared passes read this portal's archive. The running YES ledger walks every folder and finds nothing to add. The report writer overwrites the summary the compiler just made, so every portal's daily report reads the same. The fixture builder walks the archive for YES bids and produces zero cards.","Only verdict yes is surfaced for this portal, because it is not on the federal list, so a MAYBE would never reach the board either (dump_yes_for_portalpro.py:131-138). Tonight there were neither."],cells:[{label:"report.md has two writers in one run",paths:[],blocks:[`stats.json generated_at 20:59:06 UTC (compiler)
report.md stamp 22:37:28 UTC (standardizer)`,`portal-bids.json 1,470 cards total
ms-jackson cards 0
in portals list true
portal label "City of Jackson, MS"
last run date "2026-07-28"`],notes:["The compiler writes a report, then the standardizer overwrites it about an hour and a half later. What is on disk is the second one, 414 bytes.","The portal exists on the board as a name and a date. It has contributed no bids. Read from PortalPro/src/fixtures/portal-bids.json."],tables:[]},{label:"report.md, the whole file, exactly as written",paths:[],blocks:[`# City of Jackson, MS — 2026-07-28

**Source:** https://www.cityofjackson.org/Bids.aspx · engine \`civicplus\` · state MS

- Snapshot: **9** open bids
- Carryover: 6 · NEW today: 3
- Triage: 2 OPEN / 7 SKIP
- Scored: **0 YES / 0 MAYBE / 2 NO**

## YES — Max would bid

_none_

## MAYBE — operator judgment

_none_

---
_Standardized report · regenerated 2026-07-28T22:37:28+00:00_`],notes:["The report repeats state MS in its own header. Every downstream summary inherits it."],tables:[]}],notes:[],then:"bids stop being portal-shaped here, for portals that have any"},{n:"11",title:"Publish, cluster and de-duplicate: nothing to send",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → Agent bid-dedup-judge → apply_llm_dedup.py",summary:["This is where every portal's YES bids get pushed to the shared database and grouped, so one job advertised on three different boards becomes one row for the operator to look at. The publisher reads the fixture, not the archive.","The fixture has zero ms-jackson cards, so nothing is published and nothing is clustered. The run row and the portal name are still written, which is why the board knows this portal ran tonight and knows it brought nothing."],cells:[{label:"What can be checked from disk, and what cannot",paths:[],blocks:[],notes:["Which makes the Michigan finding harmless so far, and only so far. Nothing wrongly labelled has ever been pushed onto the operator's board, because nothing at all has. The mislabelling has been sitting in the archive, the report and the portal list the whole time."],tables:[[{header:!0,cells:["Claim","Status"]},{header:!1,cells:["All 34 archives contain zero yes and zero maybe verdicts","Verified on disk by reading every stats.json"]},{header:!1,cells:["The fixture the publisher reads has zero ms-jackson cards","Verified on disk in portal-bids.json"]},{header:!1,cells:["Only verdict yes travels for this portal","Code-cited at dump_yes_for_portalpro.py:131-138"]},{header:!1,cells:["No bid from this portal has ever reached the shared database","Not readable from disk. The model doc states it in its own open questions; the three rows above are the reason to believe it"]}]]}],notes:[],then:"documents and requirements, if there were any"},{n:"12",title:"Documents to the bucket, requirements out of the documents",who:"2.85b run_enrichment_phase.py · publish_bid_documents.py · 2.87 extract_doc_text.py → Agent requirements-extractor → apply_requirements.py",summary:["Bid packs are built from files. The uploader looks at every portal's snapshot and takes any row that carries a documents list. Then a separate pass works on clusters, pulls the text out of the files, and has an AI lift out bonding, insurance, licensing and dates with exact quotes.","Neither of tonight's two enriched rows has a documents key at all, so the uploader finds nothing here. Two rows now carry page_text for the first time, but page text is stored against a cluster, and this portal has no cluster."],cells:[{label:null,paths:[],blocks:[],notes:[`The registry field understates what runs. The row says enrich_passes: [], which reads as "no enrichment touches this portal". But the uploader builds its portal list by globbing data/*/bids/all-bids.json, and that pattern covers this portal's snapshot. It then keeps only rows where documents is set. So the registry field understates what the uploader can reach, and the only thing keeping this portal out of it is that no row here has ever carried a documents key. The model doc flags this as an open question and it is still open. One correction while we are here. The model doc cites that glob at publish_bid_documents.py:122. Line 122 is a database read. The glob is at line 176, the per-portal snapshot path at line 188, and the documents filter at line 193.`],tables:[]}],notes:[],then:"a second look at duplicates, now that blanks are filled"},{n:"13",title:"De-duplicate again",who:"2.875 · llm_dedup_candidates.py → Agent bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment fills in buyers and dates that were blank before, which makes new pairs of bids comparable that were not comparable an hour ago. Only that leftover is judged again, not the whole board.","This pass works entirely on the shared database. With no ms-jackson rows in it, there is nothing from this portal to compare, and no candidate pair can name it."],cells:[{label:"In → Out",paths:[{path:"clusters and dedup_adjudications",size:"shared database, not readable from disk"},{path:"data/portals/llm-dedup-candidates.json",size:"cross-portal pairs"}],blocks:[],notes:["Worth naming for the future. Both bids tonight point at an OpenGov e-procurement portal for the same city, quoted in the body: procurement.opengov.com/portal/cityofjackson. If that city is ever picked up through a second route, these are exactly the pairs this stage exists to catch, and a wrong state label on one side would make catching them harder."],tables:[]}],notes:[],then:"what changed, who gets told, did it run"},{n:"14",title:"Watch, email, and the run check",who:"2.88 · publish_page_text.py · watch_list_signals.py · bid_watch.py · new_bids_email.py · alerts_engine.py · contracts_digest.py · pipeline_sentinel.py",summary:["The free watcher compares tonight's snapshot against the last one and records status and closing-date moves. The four operator emails are built. The run checker confirms this portal actually produced a stats file tonight."],cells:[{label:null,paths:[],blocks:[],notes:["The run checker looks at whether files exist, not at whether they make sense. A portal that pulls 9 rows, judges 2 and publishes 0 looks healthy from here, and has looked healthy for 34 nights."],tables:[[{header:!0,cells:["Step","What it does here"]},{header:!1,cells:["Page text to the database","2 rows now carry page_text, but it is stored per cluster and this portal has none"]},{header:!1,cells:["List-signal watcher","works, it only needs the snapshot file, which exists"]},{header:!1,cells:["Watch v2 source re-capture",'registry says watch: "none", so there is no recipe for this portal, only the free diff']},{header:!1,cells:["The four digest emails","silently do nothing until RESEND_API_KEY exists in data/auth/resend.env"]},{header:!1,cells:["Run checker","reads daily/2026-07-28/stats.json and the latest verdicts.json; exits 1 if any portal is red"]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:['The board is Jackson, Michigan. Every field we write says Mississippi. Both detail bodies say "in the City of Jackson, Michigan" and "161 W. Michigan Avenue Jackson, Michigan 49201"; contact_phone is a 517 number; one row is "1001 Lansing Avenue". config.json says state: MS and the engine stamps City of Jackson, MS onto buyer and agency for all 9 rows',"34 archives, the daily report, the registry label and the board's portal list all carry the wrong state. No check compares the config against the page, so nothing raised it. Which city this slug was meant to cover is an operator decision, not one this page makes"]},{header:!1,cells:["The model doc says this portal has never triaged a bid OPEN and the detail fetch has never fired","Stale as of this run. 2026-07-28 records 2 OPEN, two pages fetched, two judged. The doc's stage 6 note and its open questions both need rewriting. Regenerate docs/portal-dataflow/ms-jackson.md"]},{header:!1,cells:["The model doc says the shared carry-forward script never touches this portal, because its registry row reads engine-internal","Stale. _carryforward_audit.json exists in daily/2026-06-09/ and daily/2026-06-23/, 385 bytes each, so it ran twice. Every count in both is zero only because there were no verdicts to carry. The double-merge the design forbids has never actually been put to the test"]},{header:!1,cells:["Judge flagged out_of_core_state on two bids our own files call Mississippi","The correct signal existed, once, buried inside a NO verdict nobody reads. Nothing compares a judge red flag against the portal's own state field"]},{header:!1,cells:['bid_id 210, due_date_raw: "Upon Contract", triage reason "qa-baseline"',"A test row with no closing date can never expire, so it is kept forever by the keep-if-no-close-date rule and adds one to snapshot_total every night. It is also a property listing, not a bid"]},{header:!1,cells:["new-bids.json is byte-identical to all-bids.json, 13,065 bytes, 9 rows, on a night with 3 new bids",'The name says "new", the contents are the whole snapshot. Any consumer that trusts the name over-counts this portal']},{header:!1,cells:["Registry says enrich_passes: [], but the document uploader globs data/*/bids/all-bids.json","The field understates what runs. Harmless only because no row here has ever carried a documents key. Still an open question in the model doc"]},{header:!1,cells:["judge-input.json (9 rows, 4,538 bytes) is smaller than judge-input-open.json (2 rows, 5,421 bytes)",`Not a bug. It is built before any page is fetched, so 7 of 9 bodies are the empty stub "RFP body (truncated to 6KB):\\n". The model doc omits it from stage 7's inputs even though platform_sweep.py:283 reads it`]},{header:!1,cells:["report.md is written twice in one run, at 20:59:06 then overwritten at 22:37:28","Only the second version survives. Do not look for the compiler's format on disk, it is never there"]},{header:!1,cells:["The list page carries no description; only OPEN bids ever get their page read","Triage decides on a title alone, and that decision is final for a SKIP. 7 of 9 rows tonight still have an empty description and _detail_ok: false"]},{header:!1,cells:['PORTAL.md is still an auto-generated draft, health snapshot dated 2026-07-14, every field-map row a TODO, document tier "unknown"',"There is no real runbook for this portal. The draft itself says to run /portal-audit ms-jackson, and that audit is now overdue for a second reason"]},{header:!1,cells:["Zero YES and zero MAYBE in 34 archive days","The board contributes 0 of the 1,470 cards on the operator's board while still appearing in its portal list with a fresh run date. Reading tonight's two notices, the no-fit verdicts look right on the work itself"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file, and every count traces to data/ms-jackson/daily/2026-07-28/stats.json, a row count, or a byte count. Baseline map: docs/portal-dataflow/ms-jackson.md (evidence-cited to file:line), which this page marks stale in three places: the detail fetch has now fired, bids have now reached the judge, and the shared carry-forward has run against this portal twice. No tracer bid was invented: there is no YES or MAYBE anywhere in this portal's 34 archive days, and the page says so instead of showing one."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file, and every count traces to data/ms-jackson/daily/2026-07-28/stats.json, a row count, or a byte count. Baseline map: docs/portal-dataflow/ms-jackson.md (evidence-cited to file:line), which this page marks stale in three places: the detail fetch has now fired, bids have now reached the judge, and the shared carry-forward has run against this portal twice. No tracer bid was invented: there is no YES or MAYBE anywhere in this portal's 34 archive days, and the page says so instead of showing one.",c="docs/portal-dataflow/pedia-ms-jackson.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:i,legend:r,stages:d,sections:l,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,i as funnel_note,s as headline,n as lede,r as legend,l as sections,e as slug,c as source_page,d as stages,t as title};

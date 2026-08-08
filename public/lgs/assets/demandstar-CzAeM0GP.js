const e="demandstar",t="DemandStar — what happens to a bid, stage by stage",s="Portal pedia · 02",a="DemandStar: what happens to a bid, from API to board",n="Every stage of the nightly run, with a real record from the actual files at each step. Two bids are followed the whole way — one thrown out at triage, one that reaches the board as a YES at score 90. All data is from the run of 28 July 2026.",r=[{value:"67,232",label:"in snapshot"},{value:"216",label:"new tonight"},{value:"210",label:"triaged"},{value:"5",label:"triage says open"},{value:"3",label:"yes"},{value:"2",label:"maybe"}],i="Sources: data/demandstar/bids/all-bids.json (67,232 rows, 48.1 MB) and data/demandstar/daily/2026-07-28/stats.json. 205 bids were skipped at triage and cost nothing beyond a title read. Zero NOs at the judge that night.",o=["Bid A · 544206 — Screen Printing & Embroidery, Nevada. Dies at triage.","Bid B · 544211 — On-Call Tree Trimming, Lexington County SC. Ends as YES, score 90."],d=[{n:"0",title:"The memory",who:"before anything runs",summary:["BidNet remembers with a big JSON file. DemandStar remembers with a database — its own Supabase engine DB, one row per bid ever seen. Tonight's snapshot is compared against those rows: a bid that reappears is updated, never counted as new again.",'This is the all-history diff. It is why 67,232 bids in the snapshot become only 216 "new" tonight.'],cells:[{label:"The store",paths:[{path:"engine DB table bids",size:"upsert key: source_id + dedup_fingerprint"}],blocks:[],notes:["Every field change also writes a bid_history row, so the past is queryable. Evidence: upsert_bids.py:217, :245."],tables:[]},{label:"What one night's diff did (stats.json)",paths:[],blocks:[`{
 "new_bids": 216,
 "field_changes": 875,
 "status_changes": 224,
 "disappeared": 111
}`],notes:[],tables:[]}],notes:[],then:"one API call per agency, no login anywhere"},{n:"1",title:"Pull",who:"data/demandstar/scripts/pull_bids.py",summary:["Fires one public API call per agency — 2,126 agencies polled that night, 14 at a time — and stacks every open bid into one flat snapshot. No login, no browser, no keyword filter.","What the free API never sends: a description. Title, agency, dates, status — that is the whole record. Everything else has to be fetched later, per bid."],cells:[{label:"In → Out",paths:[{path:"registry/agency-registry-FULL.json",size:"the agency list"},{path:"bids/all-bids.json",size:"48.1 MB · 67,232 rows"}],blocks:[],notes:["Also splits per state (bids/by-state/{ST}.json) and writes bids/index.json: 52 states, refreshed 18:51 UTC."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bidId": 544206,
 "title": "UNR -Outsourced Screen Printing &
 Embroidery Related Services for Athletics",
 "identifier": "Request for Proposal-RFP 9123",
 "agency": "BCN Purchasing",
 "agencyGuid": "3c077090-650a-…",
 "agencyState": "nevada",
 "broadCastDate": "07/28/2026",
 "dueDate": "08/07/2026",
 "city": "Las Vegas",
 "state": "NV",
 "planholders": "0",
 "status": "Active",
 "statusType": "AC",
 "agencyUrl": "https://www.demandstar.com/…"
}`],notes:["18 fields, no description. Note bidId is a number here — every later file makes it a string."],tables:[]}],notes:["Two hard walls at this stage. The endpoint caps at 100 bids per agency (bigger agencies lose their oldest), and Extended-Network bids never appear in per-agency search at all. What the pull cannot see, no later stage can save."],then:"the snapshot is diffed into the database"},{n:"2",title:"Diff into the database",who:"data/demandstar/scripts/upsert_bids.py",summary:["Every snapshot row is matched against the engine DB. New → inserted. Changed → updated, plus one history row per changed field. Unchanged → just a last-seen bump. Vanished from the feed → stamped disappeared_at.","Keyword hits are computed here too (word-bounded, on title + identifier + agency) — stored on the row, but not used to gate triage in daily mode."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"67,232 rows"},{path:"engine DB: bids + bid_history",size:"216 inserts · 875 field updates · 111 disappearances"}],blocks:[],notes:[],tables:[]},{label:"One real field change from that night (later exported to changed.json)",paths:[],blocks:[`{
 "field": "disappeared_at",
 "old_value": null,
 "new_value": "2026-07-28T18:51:21Z",
 "title": "DEMOLITION AND SITE RESTORATION
 OF 273 WORTMAN STREET",
 "agency": "City of Cincinnati - Purchasing",
 "source_external_id": "518845"
}`],notes:[],tables:[]}],notes:[],then:"new, still-active, undecided bids surface for the AI"},{n:"3",title:"Triage — what goes in",who:"surface_triage_candidates.py → max-triage · AI",summary:["Every Active bid with no triage decision, first seen in the last 3 days: 210 of them, as lean 10-field rows. No description exists to send, so the AI gets the title, the agency, and the dates — nothing else.","That makes this call final for SKIPs. There is no richer second look for a bid rejected here."],cells:[{label:"In → Out",paths:[{path:"engine DB table bids",size:"Active + undecided + ≤3 days"},{path:"runs/triage-candidates-2026-07-28.json",size:"0.08 MB · 210 rows"}],blocks:[],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bidId": "544206",
 "title": "UNR -Outsourced Screen Printing &
 Embroidery Related Services for Athletics",
 "agency": "BCN Purchasing",
 "state": "NV",
 "status": "Active",
 "status_type": "AC",
 "due_date": "2026-08-07",
 "broadcast_date": "2026-07-28",
 "bidUrl": "https://www.demandstar.com/app/
 suppliers/bids/544206",
 "keyword_hits": []
}`],notes:[],tables:[]}],notes:[],then:"the AI answers, and the answer is written onto the database rows"},{n:"4",title:"Triage — what comes out",who:"max-triage · AI → write_back_triage_verdicts.py",summary:["Three fields per bid. 205 SKIP, 5 OPEN. The write-back script refuses to accept the answer unless every candidate is covered and every decision is exactly OPEN or SKIP — then stamps each database row."],cells:[{label:"Out",paths:[{path:"runs/triage-verdicts-2026-07-28.json",size:"0.02 MB · 210 rows"},{path:"engine DB rows",size:"triage_decision / triage_reason / triage_at"}],blocks:[],notes:["Bid A's journey ends here. Pulled, diffed, one title read. That is its total cost."],tables:[]},{label:"Real records Bid A — rejectedBid B — opened",paths:[],blocks:[`{
 "bidId": "544206",
 "decision": "SKIP",
 "reason": "screen printing and embroidery,
 commodity"
}`,`{
 "bidId": "544211",
 "decision": "OPEN",
 "reason": "Cat 4 on-call tree trimming
 and removal"
}`],notes:[],tables:[]}],notes:[],then:"only the 5 OPENs get a browser"},{n:"5",title:"Deep extract — go get the description",who:"extract_open_bids_v2.py · headless Chromium",summary:[`For each OPEN, a headless browser opens DemandStar's public /limited/ detail page, clicks "Show More", and scrapes the scope, the field pairs, the document names and any external buyer-portal link. This is the only stage that can add a description to a DemandStar bid.`],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts-2026-07-28.json",size:"the 5 OPENs"},{path:"runs/deep-extract-results-2026-07-28.json",size:"8.3 KB · 5 rows"},{path:"source-extracts/544211/page.html",size:"raw page kept per bid"}],blocks:[`544204 ok=true scope 0 chars never rendered
544211 ok=true scope 0 chars never rendered
543840 ok=true scope 0 chars never rendered
543880 ok=true scope 27 chars
543806 ok=true scope 721 chars`],notes:[],tables:[]},{label:"Real record Bid B — the page that never rendered",paths:[],blocks:[`{
 "bid_id": "544211",
 "url": "https://www.demandstar.com/app/
 limited/bids/544211/details",
 "extracted_at": "2026-07-28T18:37:16Z",
 "ok": true,
 "title": "OpenBids-DemandStar",
 "agency": null,
 "scope": null,
 "description": "",
 "fields": {},
 "documents": [],
 "external_url": null
}`],notes:[`"OpenBids-DemandStar" is the app shell's tab title. The page never loaded — and ok says true anyway.`],tables:[]}],notes:[`Two real defects live here. First: ok means "the browser didn't crash", not "we got the page" — 3 of 5 extracts that night were empty shells and nothing flagged them. Second: when documents ARE captured, the bridge in the next stage has no documents column, so DemandStar document names are captured and then dropped. Both are confirmed in the dataflow audit.`],then:"the scrape is bridged into the database, then re-assembled for the judge"},{n:"6",title:"Judge — what goes in",who:"_backfill_bid_details_from_v2.py → surface_judge_candidates.py",summary:["The scraped fields land in the bid_details table, then the judge's input is rebuilt from the database: the bid row plus whatever the deep extract managed to get, glued into one description.","For Bid B that description is null — the page never rendered. The judge will see a title, an agency, two dates, and nothing else."],cells:[{label:"In → Out",paths:[{path:"runs/deep-extract-results-2026-07-28.json",size:"→ engine DB bid_details"},{path:"runs/judge-candidates-2026-07-28.json",size:"5.4 KB · 5 rows"}],blocks:[],notes:[],tables:[]},{label:"Real record Bid B",paths:[],blocks:[`{
 "uuid": "7d430141-bc77-4f9f-…",
 "bidId": "544211",
 "title": "On-Call Tree Trimming, Removal
 & Stump Grinding Services",
 "agency": "Lexington County, SC",
 "buyer": "Lexington County, SC",
 "state": "SC",
 "due_date": "2026-08-17",
 "contact_email": null,
 "external_status": "no_external",
 "keyword_hits": ["tree"],
 "description": null,
 "description_len": 0
}`],notes:[],tables:[]}],notes:["A quiet drop lives here. An OPEN bid whose deep extract failed hard (no bid_details row at all) is silently missing from the judge's input — it is never scored and nothing reports it. And a second file written at stage 5, judge-input-enriched-{date}.json, has no reader anywhere in the repo — it is written every night and used by nothing."],then:"the AI scores it"},{n:"7",title:"Judge — what comes out",who:"max-bid-judge · AI → write_back_judge_verdicts.py",summary:["Yes/maybe/no, a score out of 100, the reasoning, and the signal lists. The write-back validates coverage and stamps score + recommendation onto the database rows.","That night: 3 YES, 2 MAYBE, 0 NO."],cells:[{label:"Out",paths:[{path:"runs/judge-verdicts-2026-07-28.json",size:"11.2 KB · 5 rows"},{path:"engine DB rows",size:"lgs_score / lgs_recommendation / lgs_reason"}],blocks:[],notes:["Look at the red flags on Bid B. The judge knew the page never rendered — it wrote portal_page_never_rendered_scope_absent_not_empty and scored 90 from the title alone, because a verbatim Category-4 win title defaults to yes and the operator pulls the packet. The gap at stage 5 is visible here, honestly labelled."],tables:[]},{label:"Real record Bid B — YES, 90",paths:[],blocks:[`{
 "bidId": "544211",
 "title": "On-Call Tree Trimming, Removal
 & Stump Grinding Services",
 "buyer": "Lexington County, SC",
 "state": "SC",
 "would_lgs_bid": "yes",
 "score": 90,
 "category": "Category 4 - City/County Annual
 Tree Maintenance Contract",
 "primary_reason": "This title is almost
 word-for-word a contract LGS has already
 won… Countywide on-call tree work is the
 middle of our fairway…",
 "service_match": "core",
 "scale_match": "above_floor",
 "buyer_match": "core",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "portal_page_never_rendered_
 scope_absent_not_empty"
 ],
 "fit_signals": [
 "verbatim_category_4_win_title",
 "on_call_qualifier_indicates_
 above_floor_term_contract",
 "countywide_buyer_not_single_site"
 ],
 "kansas_city_risk": false,
 "closed_award": false
}`],notes:[],tables:[]}],notes:[],then:"two exports close the portal's own night"},{n:"8",title:"The exports and the archive",who:"export_for_frontend.py + daily_report.py",summary:["Two last steps inside the sweep. A keyword-filtered slice for the old static frontend, and the durable daily folder every cross-portal roll-up reads."],cells:[{label:"The frontend slice",paths:[{path:"bids/lgs-active.json",size:"138 rows"}],blocks:[],notes:['Bid B is in (keyword "tree"). Bid A is out (no keyword hits). This feed still keyword-filters even though daily triage does not — it serves the old static frontend, not PortalPro.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","216 rows, tonight's inserts","0.13 MB"]},{header:!1,cells:["changed.json","875 field-level changes","0.43 MB"]},{header:!1,cells:["disappeared.json","111 bids gone from the feed","0.05 MB"]},{header:!1,cells:["triage.json","210 decisions, tomorrow's memory","0.12 MB"]},{header:!1,cells:["stats.json","the funnel counts","tiny"]},{header:!1,cells:["report.md","human summary","363 bytes"]}]]},{label:"triage.json — Bid B as the archive keeps it",paths:[],blocks:[`{
 "source_external_id": "544211",
 "title": "On-Call Tree Trimming, Removal
 & Stump Grinding Services",
 "agency": "Lexington County, SC",
 "state": "SC",
 "triage_decision": "OPEN",
 "triage_reason": "Cat 4 on-call tree
 trimming and removal",
 "login_url": "https://www.demandstar.com/
 app/suppliers/bids/544211",
 "keyword_hits": ["tree"]
}`],notes:['Same bid, third id spelling: bidId (number) at pull, "bidId" (string) in runs, source_external_id in the archive.'],tables:[]}],notes:["What is NOT in this folder: verdicts.json. DemandStar is the one portal that never writes it. The real Pass 2 verdicts live only in runs/judge-verdicts-{date}.json. Everything downstream that expects verdicts.json has to special-case this portal — the next three stages show what that costs."],then:"the portal's own work is done — the shared machinery takes over"},{n:"9",title:"Carry forward — deliberately OFF for this portal",who:"2.5 · carry_forward_verdicts.py",summary:["On BidNet, the safety net rescues verdicts for bids that fell out of one night's pull. DemandStar skips it on purpose: its registry entry says carry_forward: none, and even forced, the script exits because the verdicts.json it merges does not exist here.","Why that is safe: the engine DB already remembers every verdict on the bid row itself. The diff never forgets a bid that is still in the feed — there is nothing for a file-level safety net to rescue."],cells:[{label:"But three consumers must then special-case demandstar",paths:[],blocks:[],notes:["The cost of the exception. 43 daily folders exist but only 27 judge-verdicts files — on the other 16 days those consumers get zero Pass 2 signal for this portal. And the standardized daily report (2.7) reads daily/verdicts.json, which never exists — DemandStar's report shows an empty YES section every single day. Tonight's report.md: 363 bytes."],tables:[[{header:!1,cells:["2.6 cumulative YES ledger","reads runs/judge-verdicts-{date}.json instead of daily verdicts"]},{header:!1,cells:["2.9 monitor board",'same swap; missing dates fall back to stats.json "opens" as the YES count']},{header:!1,cells:["2.8 PortalPro fixture dump","dedicated loader over all judge-verdicts files, with Pass-1 OPENs as fallback cards"]}]]}],notes:[],then:"bids stop being portal-shaped here"},{n:"10",title:"Onto the shared board",who:"2.8 dump_yes_for_portalpro.py → 2.85 publish, cluster, dedup",summary:["The dedicated loader turns judge verdicts into board cards — 69 DemandStar cards in the fixture that night, Bid B among them. Then everything is pushed into the board DB and clustered with every other portal's bids, so one solicitation seen on DemandStar and Bonfire becomes one row for Max."],cells:[{label:"In → Out",paths:[{path:"runs/judge-verdicts-2026-*.json",size:"all dates"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards, 69 demandstar"},{path:"board DB: bids, clusters, portals",size:"upsert + union-find clustering"}],blocks:[],notes:['One trap on this path. A Pass-1 OPEN that never got Pass 2 judged still lands on the board — as verdict "yes" with score null and the one-line triage reason as its whole description. Real cards and fallback cards sit side by side.'],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "42a6bc1d445d74dc",
 "portal": "demandstar",
 "source_bid_id": "544211",
 "title": "On-Call Tree Trimming, Removal
 & Stump Grinding Services",
 "buyer": "Lexington County, SC",
 "state": "SC",
 "score": 90,
 "verdict": "yes",
 "description": "On-Call Tree Trimming,
 Removal & Stump Grinding Services",
 "due_date": "2026-08-17",
 "contact_email": null,
 "has_documents": false
}`],notes:["The description is just the title again — the honest trace of that unrendered page at stage 5."],tables:[]}],notes:[],then:"the board tries to fill what the portal could not"},{n:"11",title:"Enrichment, documents, requirements",who:"2.85b enrich_limited.py · 2.87 requirements · 2.875 dedup re-pass",summary:["Board bids still missing a description or contact get one more visit to the public /limited/ page from a cloud browser — the real scope is appended, the contact filled, the whole page text saved, and a reason recorded for whatever stayed missing.","Then requirements are extracted per cluster with verbatim quotes, and dedup runs a second time on the freshly-filled buyers and due dates."],cells:[{label:"DemandStar's document walls (recorded as gap reasons, not blanks)",paths:[],blocks:[],notes:['Most DemandStar clusters therefore run on page text, not documents. Requirements extraction still covers them — clusters with no material at all get a neutral no-material row so the board never shows "not extracted yet".'],tables:[[{header:!1,cells:["DemandStar-native files","$5 per bid on the LGS account — a standing decision, so the reason is written instead"]},{header:!1,cells:["Externally-hosted bids","files live on the buyer's own portal; we record the register link as the reason"]},{header:!1,cells:["External page body",'the extractor captures the link only — external_status is hardcoded to "login_walled"']}]]}],notes:[],then:"what changed since last night?"},{n:"12",title:"Notice changes, send the mail, check the run",who:"2.88 · watch, emails, sentinel",summary:["For DemandStar the change signal is the daily public page-text re-capture plus the pipeline diff on due date, docs and description. The digests and the sentinel then close the night."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Re-capture /limited/ page text and diff against last capture","works for this portal"]},{header:!1,cells:["Free list-signal watcher (watch_list_signals.py)","silent no-op here — it wants a snapshot.json this portal never writes"]},{header:!1,cells:["Watch v2 (enrich_engine)","wired for demandstar-pro only, not this slug"]},{header:!1,cells:["Discovery + watch digests, deadline alerts","dead until RESEND_API_KEY is set"]},{header:!1,cells:["Sentinel","checks every portal completed every phase; writes sentinel.json"]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite — all on one card",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The free API sends no description, ever","triage is title-only and final for SKIPs; the description exists only if the deep extract renders"]},{header:!1,cells:['One bid, three id spellings — bidId number → "bidId" string → source_external_id',"any cross-file join must normalize; nothing warns on mismatch"]},{header:!1,cells:["No verdicts.json, verdicts live in runs/","carry-forward off (safe), but 4 downstream consumers special-case this portal and the daily report's YES section is permanently empty"]},{header:!1,cells:["Deep-extract ok=true ≠ page rendered","3 of 5 OPENs that night were scored from title alone; the judge flags it, nothing upstream does"]},{header:!1,cells:["lgs-active.json still keyword-filters",`that feed is the OLD frontend; PortalPro gets the unfiltered judge path — don't quote lgs-active as "the YES list"`]},{header:!1,cells:["100 bids/agency cap + Extended Network invisible + bidview login-walled","known walls; the operator link is a synthesized login_url"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to stats.json, a row count, or ls. Baseline map: docs/portal-dataflow/demandstar.md (evidence-cited to file:line). Companion pages: Portal pedia · 01 (BidNet)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to stats.json, a row count, or ls. Baseline map: docs/portal-dataflow/demandstar.md (evidence-cited to file:line). Companion pages: Portal pedia · 01 (BidNet).",c="docs/portal-dataflow/pedia-demandstar.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:r,funnel_note:i,legend:o,stages:d,sections:l,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,r as funnel,i as funnel_note,a as headline,n as lede,o as legend,l as sections,e as slug,c as source_page,d as stages,t as title};

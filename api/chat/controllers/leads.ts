const leadRecord = await prisma.lead.create({ 
	data: { 
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		phone: req.body.phone,
		email: req.body.email,
		utm_campaign: req.body.utm_campaign,
		utm_source: req.body.utm_source,
		utm_medium: req.body.utm_medium,
		campaign_id: req.body.campaignId,
		adset_id: req.body.adsetId,
		creative_id: req.body.creativeId,
		ttclid: req.body.ttclid
	} 
});

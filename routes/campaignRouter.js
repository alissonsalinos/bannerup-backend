const router = require("express").Router();
const auth = require("../middleware/auth");
const Campaign = require("../models/campaignModel");


router.post("/", auth, async (req, res) => {
    try {
    const { title, pEmpresas, pUsuarios, pRedes, pInst, app, pBnnImgUrl, pBnnImgLink, pBnnEmbedCode, appBnnImgUrl, appBnnImgLink, appBnnEmbedCode, startDate, endDate, active, userCreator } = req.body;
    
    //validation
    if (!title)
        return res.status(400).json({msg: "Preencha o campo título da campanha. "});
    if (!startDate)
        return res.status(400).json({msg: "Selecione a data inicial da campanha."}); 
    if (!endDate)
        return res.status(400).json({msg: "Selecione a data final da campanha."});
    if (!active)
        return res.status(400).json({msg: "Defina se a campanha começara ativada ou desativada"});  
    if ((!pBnnImgUrl || !pBnnImgLink) && !pBnnEmbedCode)
        return res.status(400).json({msg: "Preencha uma das formas para cadastrar a imagem do banner ou o EmbedCode."});                  
    
    const newCampaign = new Campaign({
        title,
        userId: req.user,
        pEmpresas, 
        pUsuarios, 
        pRedes, 
        pInst, 
        app, 
        pBnnImgUrl, 
        pBnnImgLink, 
        pBnnEmbedCode, 
        appBnnImgUrl, 
        appBnnImgLink,
        appBnnEmbedCode, 
        startDate, 
        endDate, 
        active,
        userCreator
    });

    const savedCampaign = await newCampaign.save();
    res.json(savedCampaign);

    } catch (err) {
       res.status(500).json({ error: err.message }); 
    }
});

router.get("/all", auth, async (req, res) => {
    const campaigns = await Campaign.find({active: "S"}).sort({"_id": -1});
    res.json(campaigns);
})

router.get("/getoneupdate/:id", auth, async (req, res) => {
    const { id } = req.params;
    const campaigns = await Campaign.findOne({_id: id});
    res.json(campaigns);
})

router.get("/allnotactive", auth, async (req, res) => {
    const campaigns = await Campaign.find({active: "N"}).sort({"_id": -1});
    res.json(campaigns);
})

router.get("/sharecampaign", async (req, res) => {
    const campaigns = await Campaign.find({active: "S", endDate: { $lte : new Date() }}).sort({"_id": -1});
    res.json(campaigns);
})

router.delete("/delete/:id", auth, async (req, res) => {
    const campaign = await Campaign.deleteOne({_id: req.params.id}, (err) => {
        if(err) return res.status(400).json({
            error: true,
            message: "Error: Artigo não foi apagado com sucesso"
        })
        return res.json({
            error: false,
            message: "Campanha apagado com sucesso"
        })
    });
    
});

router.patch("/update/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, pEmpresas, pUsuarios, pRedes, pInst, app, pBnnImgUrl, pBnnImgLink, pBnnEmbedCode, appBnnImgUrl, appBnnImgLink, appBnnEmbedCode, startDate, endDate, active, userCreator, userUpdater, updatedAt } = req.body; 
        
        const campaign = await Campaign.findOne({_id: id});
        if (!campaign)
            return res.status(400).json({msg: "Não foi encontrada a campanha específica para a edição."});

        const updatedCampaign =  { title, pEmpresas, pUsuarios, pRedes, pInst, app, pBnnImgUrl, pBnnImgLink, pBnnEmbedCode, appBnnImgUrl, appBnnImgLink, appBnnEmbedCode, startDate, endDate, active, userCreator, userUpdater, updatedAt, _id: id }    
        await Campaign.findByIdAndUpdate(id, updatedCampaign, { new: true }); 
        res.json(updatedCampaign);       

    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }

router.patch("/updatestatus/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const {  active } = req.body; 
        
        const campaign = await Campaign.findOne({_id: id});
        if (!campaign)
            return res.status(400).json({msg: "Não foi encontrada a campanha específica para a edição."});

        const updatedStatusCampaign =  {  active, _id: id }    
        await Campaign.findByIdAndUpdate(id, updatedStatusCampaign, { new: true }); 
        res.json(updatedStatusCampaign);    

    } catch (err) {
        res.status(500).json({ error: err.message });  
    }
})    
  
})

module.exports = router;
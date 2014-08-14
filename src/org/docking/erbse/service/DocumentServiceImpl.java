package org.docking.erbse.service;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.DocumentVO;
import org.docking.erbse.vo.MemberContentVO;


public class DocumentServiceImpl implements DocumentService {

	@Override
	public Integer documentAdd(DocumentVO document, MemberContentVO memberContent) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		Integer res = genericService.add("document_add", document);
		
		GenericService<MemberContentVO>	mService = new GenericServiceImpl<MemberContentVO>();
		res += mService.add("memberContent_add", memberContent);

		return res;
	}

	@Override
	public Integer documentModify(DocumentVO document) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		Integer res = genericService.modify("document_modify", document);

		return res;	
	}
	
	@Override
	public String documentSearch(String documentId) 
	{
		GenericService<DocumentVO>	docService = new GenericServiceImpl<DocumentVO>();
		DocumentVO dvo = docService.search("document_search", documentId);
		
		String[] objName = new String[]{"modifyDocumentVO"};

		/*
		 * DocumentVO Json
		 */
		String jEvo = JsonParser.getInstance().jParseObj(GlobalVariable.M_DOC_VO_FIELD, new String[]{dvo.getDocumentId(),dvo.getWriter(),dvo.getTitle(),dvo.getCreationDate()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEvo});

		/*GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		List<ContentVO> cvoList = conService.searchAll("content_searchAll_key", documentId);

		GenericService<MemberContentVO>	memService = new GenericServiceImpl<MemberContentVO>();
		List<MemberContentVO> mcvoList = memService.searchAll("memberContent_searchAll_key", documentId);

		String[] objName = new String[]{"documentVO","contentVOList","memberContentVOList"};
		
		String jDvo = JsonParser.getInstance().jParseObj(GlobalVariable.DOC_VO_FIELD, new String[]{dvo.getDocumentId(),dvo.getWriter(),dvo.getTitle(),dvo.getCreationDate()});
		List<String> tmpList = new ArrayList<String>();		
		
		for(ContentVO tcvo : cvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.CON_VO_FIELD, new String[]{tcvo.getDocumentId(),tcvo.getContentId(),tcvo.getBody(),tcvo.getEditorId()}));
		}
		
		String[] cvoArr = new String[cvoList.size()];
		cvoArr = tmpList.toArray(cvoArr);
		String jCvoList = JsonParser.getInstance().jParseArr(cvoArr);
		
		tmpList.clear();
		for(MemberContentVO tmcvo : mcvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.MEMCON_VO_FIELD, new String[]{tmcvo.getDocumentId(),tmcvo.getMemberId(),String.valueOf(tmcvo.getMemberPosition())}));
		}
		String[] mcvoArr = new String[mcvoList.size()];
		mcvoArr = tmpList.toArray(mcvoArr);
		String jMcvoList = JsonParser.getInstance().jParseArr(mcvoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jDvo,jCvoList,jMcvoList});*/
	}

	@Override
	public Integer documentDelete(String documentId) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		Integer res = genericService.delete("document_delete", documentId);
		
		GenericService<MemberContentVO>	mService = new GenericServiceImpl<MemberContentVO>();
		res += mService.delete("memberContent_deleteByDocumentId", documentId);
		
		GenericService<ContentVO>	cService = new GenericServiceImpl<ContentVO>();
		res += cService.delete("content_deleteByDocumentId", documentId);

		return res;
	}


	@Override
	public String ownDocumentList(String documentId) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		List<ContentVO> dvoList = genericService.searchAll("content_searchAll_key", documentId);
		
		GenericService<MemberContentVO>	mService = new GenericServiceImpl<MemberContentVO>();
		List<MemberContentVO> mList = mService.searchAll("memberContent_searchAllbyDocId", documentId);
		
		List<String> tmpList = new ArrayList<String>();
		List<String> tmpList2 = new ArrayList<String>();
		
		String[] objName = new String[]{"editorInfo","memberInfo"};

		for(ContentVO tdvo : dvoList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.M_CON_VO, new String[]{tdvo.getDocumentId(),tdvo.getContentId(),tdvo.getBody(),tdvo.getEditorId()}));
		}
		
		for(MemberContentVO vo : mList)
		{
			tmpList2.add(JsonParser.getInstance().jParseObj(GlobalVariable.MEMCON_VO_FIELD, new String[]{vo.getDocumentId(),vo.getMemberId(),String.valueOf(vo.getMemberPosition())}));
		}
		
		String[] dvoArr = new String[dvoList.size()];
		dvoArr = tmpList.toArray(dvoArr);
		String jDvoList = JsonParser.getInstance().jParseArr(dvoArr);
		
		String[] dvoArr2 = new String[mList.size()];
		dvoArr2 = tmpList2.toArray(dvoArr2);
		String jDvoList2 = JsonParser.getInstance().jParseArr(dvoArr2);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jDvoList,jDvoList2});
	}

	@Override
	public String joinDocumentList(String memberId , String logInMember) 
	{
		GenericService<MemberContentVO>	memService = new GenericServiceImpl<MemberContentVO>();
		List<MemberContentVO> mcvoList = memService.searchAll("memberContent_searchAllbyMemberId", memberId);

		GenericService<DocumentVO>	docService = new GenericServiceImpl<DocumentVO>();
		List<DocumentVO> dvoList = new ArrayList<DocumentVO>();
		
		for(int i = 0 ; i < mcvoList.size() ; i++)
		{
			dvoList.add(docService.search("document_search", mcvoList.get(i).getDocumentId()));
		}
		
		String[] objName = new String[]{"documentVOList"};

		List<String> tmpList = new ArrayList<String>();	
		
		for(DocumentVO dvo : dvoList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.DOC_VO_FIELD, new String[]{dvo.getDocumentId(),dvo.getWriter(),dvo.getTitle(),dvo.getCreationDate(),logInMember}));
		}
		
		String[] dvoArr = new String[dvoList.size()];
		dvoArr = tmpList.toArray(dvoArr);
		String jDvoList = JsonParser.getInstance().jParseArr(dvoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jDvoList});
		
		/*String[] objName = new String[]{"memberContentVOList","documentVOList"};

		List<String> tmpList = new ArrayList<String>();		
		
		for(MemberContentVO mcvo : mcvoList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.MEMCON_VO_FIELD, new String[]{mcvo.getDocumentId(),mcvo.getMemberId(),String.valueOf(mcvo.getMemberPosition())}));
		}
		
		String[] mcvoArr = new String[dvoList.size()];
		mcvoArr = tmpList.toArray(mcvoArr);
		String jMcvoList = JsonParser.getInstance().jParseArr(mcvoArr);

		for(DocumentVO dvo : dvoList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.DOC_VO_FIELD, new String[]{dvo.getDocumentId(),dvo.getWriter(),dvo.getTitle(),dvo.getCreationDate()}));
		}
		
		String[] dvoArr = new String[dvoList.size()];
		dvoArr = tmpList.toArray(dvoArr);
		String jDvoList = JsonParser.getInstance().jParseArr(dvoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jMcvoList,jDvoList});*/
	}

	@Override
	public Integer contentAdd(ContentVO content) 
	{
		GenericService<ContentVO> conService = new GenericServiceImpl<ContentVO>();
		Integer res = conService.add("content_add", content);

		return res;
	}

	@Override
	public Integer contentModify(ContentVO content) 
	{
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();

		Integer res = conService.modify("content_modify", content);
		
		return res;	
	}

	@Override
	public String contentSearch(String contentId) 
	{
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		ContentVO cvo = conService.search("content_search", contentId);

		String[] objName = new String[]{"contentVO"};

		String jCvo = JsonParser.getInstance().jParseObj(GlobalVariable.M_CON_VO, new String[]{cvo.getDocumentId(),cvo.getContentId(),cvo.getBody(),cvo.getEditorId()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jCvo});
	}

	@Override
	public Integer contentDelete(String contentId) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		Integer res = 		genericService.delete("content_delete", contentId);

		return res;
	}

	@Override
	public String contentsList(String documentId, String logInMember) 
	{
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		List<ContentVO> cvoList = conService.searchAll("content_searchAll_key", documentId);
		
		GenericService<DocumentVO>	dService = new GenericServiceImpl<DocumentVO>();
		DocumentVO	dvo = dService.search("document_search", documentId);

		String[] objName = new String[]{"contentVOList"};
		List<String> tmpList = new ArrayList<String>();		

		for(ContentVO cvo : cvoList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.CON_VO_FIELD, new String[]{documentId,cvo.getContentId(),cvo.getBody(),cvo.getEditorId(),dvo.getTitle(),dvo.getWriter(),logInMember}));
		}
		
		String[] cvoArr = new String[cvoList.size()];
		cvoArr = tmpList.toArray(cvoArr);
		String jCvoList = JsonParser.getInstance().jParseArr(cvoArr);
		
		System.out.println(documentId);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jCvoList});
	}

	@Override
	public Integer memberInvite(MemberContentVO memberContent) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		Integer res = genericService.add("memberContent_add", memberContent);
		
		return res;
	}

	@Override
	public Integer memberExpel(MemberContentVO memberContent) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		Integer res = genericService.delete("memberContent_delete", memberContent);

		return res;
	}

	@Override
	public Integer memberPositionUpdate(MemberContentVO memberContent) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		Integer res = genericService.modify("memberContent_modify", memberContent);	

		return res;
	}
}

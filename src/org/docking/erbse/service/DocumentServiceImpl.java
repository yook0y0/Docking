package org.docking.erbse.service;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.JsonParseData;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.DocumentVO;
import org.docking.erbse.vo.MemberContentVO;


public class DocumentServiceImpl implements DocumentService {

	@Override
	public Integer documentAdd(DocumentVO document) {
		// TODO Auto-generated method stub
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.add("document_add", document);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public Integer documentModify(DocumentVO document) {
		// TODO Auto-generated method stub
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.modify("document_modify", document);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;	
	}
	
	@Override
	public String documentSearch(String documentId) {
		// TODO Auto-generated method stub

		GenericService<DocumentVO>	docService = new GenericServiceImpl<DocumentVO>();
		DocumentVO dvo = docService.search("document_search", documentId);

		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		List<ContentVO> cvoList = conService.searchAll("content_searchAll_key", documentId);

		GenericService<MemberContentVO>	memService = new GenericServiceImpl<MemberContentVO>();
		List<MemberContentVO> mcvoList = memService.searchAll("memberContent_searchAll_key", documentId);

		String[] objName = new String[]{"documentVO","contentVOList","memberContentVOList"};
		
		/*
		 * DocumentVO Json
		 */
		String jDvo = JsonParser.getInstance().jParseObj(JsonParseData.DOC_VO_FIELD, new String[]{dvo.getDocumentId(),dvo.getWriter(),dvo.getTitle(),dvo.getCreationDate()});
		List<String> tmpList = new ArrayList<String>();		
		
		/*
		 * ContentVO List Json
		 */
		for(ContentVO tcvo : cvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.CON_VO_FIELD, new String[]{tcvo.getDocumentId(),tcvo.getContentId(),tcvo.getBody(),tcvo.getEditorId()}));
		}
		String[] cvoArr = new String[cvoList.size()];
		cvoArr = tmpList.toArray(cvoArr);
		String jCvoList = JsonParser.getInstance().jParseArr(cvoArr);
		
		/*
		 * MemberContentVO Json
		 */
		tmpList.clear();
		for(MemberContentVO tmcvo : mcvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.MEMCON_VO_FIELD, new String[]{tmcvo.getDocumentId(),tmcvo.getMemberId(),String.valueOf(tmcvo.getMemberPosition())}));
		}
		String[] mcvoArr = new String[mcvoList.size()];
		mcvoArr = tmpList.toArray(mcvoArr);
		String jMcvoList = JsonParser.getInstance().jParseArr(mcvoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jDvo,jCvoList,jMcvoList});
	}

	@Override
	public Integer documentDelete(String documentId) {
		// TODO Auto-generated method stub
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.delete("document_delete", documentId);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}


	@Override
	public String ownDocumentList(String writer) {
		// TODO Auto-generated method stub
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		List<DocumentVO> dvoList = genericService.searchAll("document_searchAll_key", writer);
		
		List<String> tmpList = new ArrayList<String>();
		
		String[] objName = new String[]{"documentVOList"};
		
		/*
		 * DocumentVO List Json
		 */
		for(DocumentVO tdvo : dvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.DOC_VO_FIELD, new String[]{tdvo.getDocumentId(),tdvo.getWriter(),tdvo.getTitle(),tdvo.getCreationDate()}));
		}
		String[] dvoArr = new String[dvoList.size()];
		dvoArr = tmpList.toArray(dvoArr);
		String jDvoList = JsonParser.getInstance().jParseArr(dvoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jDvoList});
	}

	@Override
	public String joinDocumentList(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	memService = new GenericServiceImpl<MemberContentVO>();
		List<MemberContentVO> mcvoList = memService.searchAll("memberContent_searchAllbyMemberId", memberId);

		System.out.println("mcvoList size : " + mcvoList.size());
		GenericService<DocumentVO>	docService = new GenericServiceImpl<DocumentVO>();

		List<DocumentVO> dvoList = new ArrayList<DocumentVO>();
		for(int i=0;i<mcvoList.size();i++){
			dvoList.add(i, docService.search("document_search", mcvoList.get(i).getDocumentId()));
		}
		System.out.println("dvoList size : " + dvoList.size());
		
		String[] objName = new String[]{"memberContentVOList","documentVOList"};

		List<String> tmpList = new ArrayList<String>();		
		
		/*
		 * DocumentVO List Json
		 */
		for(MemberContentVO mcvo : mcvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.MEMCON_VO_FIELD, new String[]{mcvo.getDocumentId(),mcvo.getMemberId(),String.valueOf(mcvo.getMemberPosition())}));
		}
		String[] mcvoArr = new String[dvoList.size()];
		mcvoArr = tmpList.toArray(mcvoArr);
		String jMcvoList = JsonParser.getInstance().jParseArr(mcvoArr);

		/*
		 * DocumentVO List Json
		 */
		for(DocumentVO dvo : dvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.DOC_VO_FIELD, new String[]{dvo.getDocumentId(),dvo.getWriter(),dvo.getTitle(),dvo.getCreationDate()}));
		}
		String[] dvoArr = new String[dvoList.size()];
		dvoArr = tmpList.toArray(dvoArr);
		String jDvoList = JsonParser.getInstance().jParseArr(dvoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jMcvoList,jDvoList});
	}

	@Override
	public Integer contentAdd(ContentVO content) {
		// TODO Auto-generated method stub
		GenericService<ContentVO> conService = new GenericServiceImpl<ContentVO>();
		conService.add("content_add", content);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public Integer contentModify(ContentVO content) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		conService.modify("content_modify", content);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;	
	}

	@Override
	public String contentSearch(String contentId) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		ContentVO cvo = conService.search("content_search", contentId);

		String[] objName = new String[]{"contentVO"};

		/*
		 * DocumentVO Json
		 */
		String jCvo = JsonParser.getInstance().jParseObj(JsonParseData.CON_VO_FIELD, new String[]{cvo.getDocumentId(),cvo.getContentId(),cvo.getBody(),cvo.getEditorId()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jCvo});
	}

	@Override
	public Integer contentDelete(String contentId) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.delete("content_delete", contentId);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public String contentsList(String documentId) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		List<ContentVO> cvoList = conService.searchAll("content_searchAll_key", documentId);

		String[] objName = new String[]{"contentVOList"};
		List<String> tmpList = new ArrayList<String>();		
		
		/*
		 * DocumentVO List Json
		 */
		for(ContentVO cvo : cvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.CON_VO_FIELD, new String[]{cvo.getDocumentId(),cvo.getContentId(),cvo.getBody(),cvo.getEditorId()}));
		}
		String[] cvoArr = new String[cvoList.size()];
		cvoArr = tmpList.toArray(cvoArr);
		String jCvoList = JsonParser.getInstance().jParseArr(cvoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jCvoList});
	}

	@Override
	public Integer memberInvite(MemberContentVO memberContent) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.add("memberContent_add", memberContent);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public Integer memberExpel(MemberContentVO memberContent) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.delete("memberContent_delete", memberContent);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public Integer memberPositionUpdate(MemberContentVO memberContent) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.modify("memberContent_modify", memberContent);	

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

}

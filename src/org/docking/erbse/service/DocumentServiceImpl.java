package org.docking.erbse.service;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
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
		 * res 값 처리 필요
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
		 * res 값 처리 필요
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
		
		/*
		 * Json Obj name으로 쓸거
		 */
		String[] objName = new String[]{"documentVO","contentVOList","memberContentVOList"};
		String[] dvoField = new String[]{"documentId","writer","title","creationDate"};
		String[] cvoField = new String[]{"documentId","contentId","body","editorId"};
		String[] mcvoField = new String[]{"documentId","memberId","memberPosition"};

		/*
		 * DocumentVO Json으로 변환
		 */
		String jDvo = JsonParser.getInstance().jParseObj(dvoField, new String[]{dvo.getDocumentId(),dvo.getWriter(),dvo.getTitle(),dvo.getCreationDate()});
		List<String> tmpList = new ArrayList<String>();		
		
		/*
		 * ContentVO List Json으로 변환
		 */
		for(ContentVO tcvo : cvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(cvoField, new String[]{tcvo.getDocumentId(),tcvo.getContentId(),tcvo.getBody(),tcvo.getEditorId()}));
		}
		String[] cvoArr = new String[cvoList.size()];
		cvoArr = cvoList.toArray(cvoArr);
		String jCvoList = JsonParser.getInstance().jParseArr(cvoArr);
		
		/*
		 * MemberContentVO Json으로 변환
		 */
		tmpList.clear();
		for(MemberContentVO tmcvo : mcvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(mcvoField, new String[]{tmcvo.getDocumentId(),tmcvo.getMemberId(),String.valueOf(tmcvo.getMemberPosition())}));
		}
		String[] mcvoArr = new String[mcvoList.size()];
		mcvoArr = mcvoList.toArray(mcvoArr);
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
		 * res 값 처리 필요
		 */
		return res;
	}


	@Override
	public String ownDocumentList(String writer) {
		// TODO Auto-generated method stub
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		List<DocumentVO> dvoList = genericService.searchAll("document_searchAll_key", writer);
		
		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}

	@Override
	public String joinDocumentList(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	memService = new GenericServiceImpl<MemberContentVO>();
		List<MemberContentVO> mcvoList = memService.searchAll("memberContent_searchAll_key", memberId);

		GenericService<DocumentVO>	docService = new GenericServiceImpl<DocumentVO>();

		List<DocumentVO> dvoList = new ArrayList<DocumentVO>();
		for(int i=0;i<mcvoList.size();i++){
			dvoList.set(i, docService.search("document_search", mcvoList.get(i).getDocumentId()));
		}
		/*
		 * Json String
		 */
		
		return null;
	}

	@Override
	public Integer contentAdd(ContentVO content) {
		// TODO Auto-generated method stub
		GenericService<ContentVO> conService = new GenericServiceImpl<ContentVO>();
		conService.add("content_add", content);

		Integer res = 0;
		/*
		 * res 값 처리 필요
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
		 * res 값 처리 필요
		 */
		return res;	
	}

	@Override
	public String contentSearch(String contentId) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		ContentVO cvo = conService.search("content_search", contentId);

		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}

	@Override
	public Integer contentDelete(String contentId) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.delete("content_delete", contentId);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public String contentsList(String documentId) {
		// TODO Auto-generated method stub
		GenericService<ContentVO>	conService = new GenericServiceImpl<ContentVO>();
		List<ContentVO> cvo = conService.searchAll("content_searchAll_key", documentId);

		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}

	@Override
	public Integer memberInvite(MemberContentVO memberContent) {
		// TODO Auto-generated method stub
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.add("memberContent_add", memberContent);

		Integer res = 0;
		/*
		 * res 값 처리 필요
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
		 * res 값 처리 필요
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
		 * res 값 처리 필요
		 */
		return res;
	}

}

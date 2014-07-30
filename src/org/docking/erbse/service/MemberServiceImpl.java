package org.docking.erbse.service;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.JsonParseData;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.MemberVO;


public class MemberServiceImpl implements MemberService {

	@Override
	public Integer memberAdd(MemberVO member) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		memService.add("member_add", member);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public Integer memberModify(MemberVO member) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		memService.modify("member_modify", member);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public String memberSearch(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		MemberVO mvo = memService.search("member_search", memberId);

		String[] objName = new String[]{"memberVO"};

		/*
		 * DocumentVO Json
		 */
		String jMvo = JsonParser.getInstance().jParseObj(JsonParseData.MEM_VO_FIELD, new String[]{mvo.getMemberId(),mvo.getPw(),mvo.getMemberName(),String.valueOf(mvo.getType())});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jMvo});
	}

	@Override
	public Integer memberDelete(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.delete("member_delete", memberId);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}
}
